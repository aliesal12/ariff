import os
import datetime
import time
import subprocess
from flask import Flask, render_template, request, jsonify
from os import getenv
import numpy as np
from datetime import datetime
import mysql.connector
from mysql.connector import Error
import pandas as pd
from mysql.connector import errorcode
import re
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from mysql.connector import IntegrityError
from openpyxl import load_workbook
from openpyxl.styles import Font, Alignment

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='admin',
            password='root',
            database='arif_academy'
        )
        
        if connection.is_connected():
            return connection
                
    except Error as e:
        print("Error while connecting to MySQL", e)

def generate_records(cursor ,today):
    cursor.execute("SELECT * FROM students;")
    students=cursor.fetchall()
    student_df=pd.DataFrame({"Name":[str(i[0]) for i in students], "FATHER_NAME":[str(i[1]) for i in students], 
                "Gr_no":[str(i[2]) for i in students],"Registration_No":[str(i[3]) for i in students],
                "DOB":[str(i[4]) for i in students],"Contact":[str(i[5]) for i in students],
                "Alternate_Contact":[str(i[6]) for i in students],"Admission_Fees":[str(i[7]) for i in students],
                "Annual_Fund":[i[8] for i in students],"B_Form":[str(i[9]) for i in students],
                "Month_Fees":[str(i[10]) for i in students],"Class":[str(i[11]) for i in students]})

    cursor.execute("SELECT f.ID, f.Registration_No, s.Name, f.Due_date, f.Dues, f.Status, f.advance_months, f.advance_payment, f.month, f.amount_paid, f.advance_payments_last, f.advance_specific_month FROM fee f INNER JOIN students s ON f.Registration_No=s.Registration_No;")
    students=cursor.fetchall()
    student_fee_df=pd.DataFrame({"Payment_ID":[str(i[0]) for i in students], "Registration Number":[str(i[1]) for i in students], 
                "Name":[str(i[2]) for i in students],"Due Date":[str(i[3]) for i in students],
                "Dues":[i[4] for i in students],"Status":[str(i[5]) for i in students],
                "Advance Months":[i[6] for i in students],"Advance Payment":[i[7] for i in students],
                "Month":[i[8] for i in students],"Amount Paid":[i[9] for i in students],
                "Previous Advanced Payment":[i[10] for i in students],"Advance for Specific Month":[i[11] for i in students]})

    cursor.execute("SELECT p.CNIC, t.Name, p.Payment_ID, p.Attendence, p.Total_Payment, p.Medical_Allowance, p.basic_sal, p.deductions, p.advance, p.att_allowance, p.period_engage, p.add_allowance, p.monthh FROM payment p INNER JOIN teachers t ON p.CNIC=t.CNIC;")
    teachers=cursor.fetchall()
    teachers_payment_df=pd.DataFrame({"CNIC":[str(i[0]) for i in students], "Name":[str(i[1]) for i in students], 
                "Payment ID":[str(i[2]) for i in students],"Attendance":[i[3] for i in students],
                "Total Payment":[i[4] for i in students],"Medical Allowance":[i[5] for i in students],
                "Basic Salary":[i[6] for i in students],"Deductions":[i[7] for i in students],
                "Advance":[i[8] for i in students],"Attendance Allowance":[i[9] for i in students],
                "Period Engage":[str(i[10]) for i in students],"Additional Allowance":[i[11] for i in students],
                "Month":[i[11] for i in students]})

    cursor.execute("SELECT * FROM teachers;")
    teachers=cursor.fetchall()
    teachers_df=pd.DataFrame({"CNIC":[str(i[0]) for i in teachers], "Name":[str(i[1]) for i in teachers], 
                "Salary":[str(i[2]) for i in teachers],"CONTACT":[str(i[3]) for i in teachers],
                "Date_OF_Joining":[str(i[4]) for i in teachers]})
    if not os.path.exists('final_data'):
        os.makedirs('final_data')
    with pd.ExcelWriter(f'final_data/final_data_{int(today.year)-1}_{int(today.year)}.xlsx') as writer:
        student_df.to_excel(writer, sheet_name='Students', index=False)
        teachers_df.to_excel(writer, sheet_name='Teachers', index=False)
        student_fee_df.to_excel(writer, sheet_name='Student_fees', index=False)
        teachers_payment_df.to_excel(writer, sheet_name='Teacher Payments', index=False)

    cursor.execute("DELETE FROM fee;")
    cursor.execute("DELETE FROM payment;")

def create_balance_sheet(df, year1,year2,sheet,total):
    assets=df[df['code']==1].sort_values('code')
    liabcap=df[df['code'].isin([2,3])].sort_values('code')
    assets.fillna(0,inplace=True)
    assets['Debit']=assets['Debit']-assets['Credit']
    assets=assets.drop(columns=['Credit','diff','code'],axis=1).reset_index(drop=True)
    liabcap.fillna(0,inplace=True)
    liabcap['Credit']=liabcap['Credit']-liabcap['Debit']
    liabcap.drop(columns=['Debit','diff','code'],axis=1,inplace=True)
    liabcap.rename(columns={'Head':'Head2'},inplace=True)
    liabcap=pd.concat([liabcap,pd.DataFrame({'Head2':['Profit & Loss'],'Credit':[total]})],axis=0).reset_index(drop=True)
    balance_sheet=pd.concat([assets,liabcap],axis=1)
    balance_sheet=pd.concat([balance_sheet,pd.DataFrame({'Debit':[balance_sheet['Debit'].sum()],'Credit':[balance_sheet['Credit'].sum()]})])
    balance_sheet['Debit']=balance_sheet['Debit'].astype('str')
    balance_sheet['Credit']=balance_sheet['Credit'].astype('str')
    balance_sheet['Debit']=np.where((balance_sheet['Debit'].str[0]=='-'),'('+balance_sheet['Debit'].str[1:]+')',balance_sheet['Debit'])
    balance_sheet['Credit']=np.where((balance_sheet['Credit'].str[0]=='-'),'('+balance_sheet['Credit'].str[1:]+')',balance_sheet['Credit'])
    balance_sheet=balance_sheet.apply(lambda x: x.str.replace('nan',''))
    return balance_sheet

def generate_cashbook(df):
    df=df[['Date', 'Head','Debit','Credit','Opening Bal','Closing Bal']]
    cash=df[df['Head']=='Cash']
    bank=df[df['Head']=='1010: Current (Bank Account)']
    if len(cash)>0:
        cash=pd.concat([cash,pd.DataFrame({'Credit':['Opening Balance', 'Closing Balance'],'Closing Bal':[int(cash.iloc[0,4]),int(cash.iloc[-1,5])]})])
    if len(bank)>0:
        bank=pd.concat([bank,pd.DataFrame({'Credit':['Opening Balance', 'Closing Balance'],'Closing Bal':[int(bank.iloc[0,4]),int(bank.iloc[-1,5])]})])
    cc_bb=[cash,bank]
    return cc_bb

def create_trial_balance(df):
    df['code']=df['Head'].str[0]
    df['code']=np.where(df['code']=='C','1',df['code'])
    df['code']=df['code'].astype('int64')
    cash_book=generate_cashbook(df)
    df=df.groupby(['Head','code'])[['Debit','Credit']].sum().reset_index()
    df['diff']=df['Debit']-df['Credit']
    df['Debit']=np.where(df['diff']>0,df['diff'],np.nan)
    df['Credit']=np.where(df['diff']<0,df['diff']*(-1),np.nan)
    df=df.sort_values('Debit')
    trial_bal=df[['Head','Debit','Credit']]
    trial_bal=pd.concat([trial_bal,pd.DataFrame({'Head':['Total'],'Debit':[df['Debit'].sum()],'Credit':[df['Credit'].sum()]})],axis=0)
    return df, trial_bal, cash_book

def create_income_statement(df, year1,year2,sheet,month=None):
    if month is not None:
        d=df[df['Month'].isin(month)]
    else:
        d=df
    df, trial_bal, cash_book=create_trial_balance(d)
    income_statement=df[(df['code']==4)|(df['code']>=5)].sort_values('code')
    income_statement.drop(columns=['diff'],axis=1,inplace=True)
    income_statement=pd.concat([income_statement,pd.DataFrame({'Head':['Total Exppenditure','Net Income / Loss'],'Credit':[-1*income_statement['Debit'].sum(),income_statement['Credit'].sum()-income_statement['Debit'].sum()]})],axis=0)
    income_statement.fillna(0,inplace=True)
    total=int(list(income_statement.loc[income_statement['Head']=='Net Income / Loss','Credit'])[0])
    income_statement['Debit']=income_statement['Debit'].astype('str')
    income_statement['Credit']=income_statement['Credit'].astype('str')
    income_statement['Debit']=np.where(((income_statement['Debit'].str[0]=='-')|(income_statement['Debit']=='0.0')),income_statement['Debit'].str[1:],'('+income_statement['Debit'].str[:]+')')
    income_statement['Credit']=np.where(((income_statement['Credit'].str[0]=='-')&(income_statement['Credit']!='0.0')),'('+income_statement['Credit'].str[1:]+')',income_statement['Credit'])
    income_statement['Debit']=np.where(income_statement['Debit'].isin(['.0','0.0']),"",income_statement['Debit'])
    income_statement['Credit']=np.where(income_statement['Credit'].isin(['.0','0.0']),"",income_statement['Credit'])
    income_statement.drop(columns=['code'],axis=1,inplace=True)
    bal_sheet=create_balance_sheet(df,year1,year2,sheet,total)
    return (trial_bal,income_statement,bal_sheet,cash_book,sheet)

def convert_to_float(val):
        if isinstance(val, str):
            if val.startswith('(') and val.endswith(')'):
                return -float(val.strip('()').replace(',', ''))
            else:
                return float(val.replace(',', ''))
        return val

def generate_cashflows(df2,df1, year1, year2):
    # Convert string columns to float
    for df in [df1, df2]:
        for col in ['Credit', 'Debit']:
            if df[col].dtype == 'object':
                df[col] = df[col].apply(convert_to_float)
    
    df1=df1.iloc[:-1]
    df2=df2.iloc[:-1]
    df1=pd.concat([df1[['Head','Debit']],df1[['Head2','Credit']].rename(columns={'Head2':'Head','Credit':'Debit'})],axis=0)
    df2=pd.concat([df2[['Head','Debit']],df2[['Head2','Credit']].rename(columns={'Head2':'Head','Credit':'Debit'})],axis=0)
    df1.dropna(inplace=True)
    df2.dropna(inplace=True)

    # Combine DataFrames
    combined_df = pd.concat([df1.set_index('Head'), df2.set_index('Head')], axis=1, keys=['Current', 'Previous'])
    combined_df = combined_df.fillna(0)


    # Calculate changes
    changes = combined_df['Current'] - combined_df['Previous']

    # Define account classifications
    op = [
        '1210: Accounts Receivable', '1310: Inventory', '2010: Accounts Payable',
        '2115: Accrued Employee Benefits', '1220: Fee Receivable', '1320: Stationery Unused/ Stock',
        '1330: Printed Supplies Unused/ Stock', '1410: Prepaid Expenses', '2100: Accrued Salaries',
        '2110: Accrued daily Wages', '2150: Accrued Any taxes and duties', '2200: Advanced Fee Received',
        '2250: Rent Payable', '2260: Utilities Payable', '2300: Misc. Services Payable'
    ]
    
    iv = [
        '1510: Property / Building', '1520: Furniture & Fixtures', '1530: Lab. Equipment (Electronic)/ Mechanical',
        '1540: Equipment (Electronic)/ Mechanical', '1590: Accumulated Depreciation (Contra Assets)',
        '1690: Accumulated Amortization (Contra Assets)'
    ]
    
    fa = [
        '3100: Capital', '3200: Profit or Loss Reserve A/c', '3300: Drawings (Contra Equity)'
    ]

    operating_accounts = [i for i in op if i in list(combined_df.index)]
    investing_accounts = [i for i in iv if i in list(combined_df.index)]
    financing_accounts = [i for i in fa if i in list(combined_df.index)]

    print(operating_accounts)

    # Calculate cash flows
    operating_cash_flow = -changes.loc[operating_accounts].sum()
    investing_cash_flow = -changes.loc[investing_accounts].sum()
    financing_cash_flow = changes.loc[financing_accounts].sum()

    # Calculate net change in cash
    net_change_in_cash = operating_cash_flow + investing_cash_flow + financing_cash_flow

    # Create cash flow statement DataFrame
    cash_flow_statement = pd.DataFrame({
        'Activity': ['Operating Activities', 'Investing Activities', 'Financing Activities', 'Net Change in Cash'],
        'Amount': [int(operating_cash_flow), int(investing_cash_flow), int(financing_cash_flow), int(net_change_in_cash)]
    })

    return cash_flow_statement

def adjust_accounts(bal_sheet,year1,year2):
    if bal_sheet['Debit'].dtype=='object':
        bal_sheet['Debit']=bal_sheet['Debit'].str.replace('(','-')
        bal_sheet['Debit']=bal_sheet['Debit'].str.replace(')','')
    if bal_sheet['Credit'].dtype=='object':
        bal_sheet['Credit']=bal_sheet['Credit'].str.replace('(','-')
        bal_sheet['Credit']=bal_sheet['Credit'].str.replace(')','-')
    bal_sheet['Debit']=bal_sheet['Debit'].astype('float64')
    bal_sheet['Credit']=bal_sheet['Credit'].astype('float64')
    bal_sheet=bal_sheet.drop(bal_sheet.index[-1])
    accounts_path=f'Arif Academy School Management System/static/xlscsv/accounts_{year1}_{year2}.csv'
    acc=pd.read_csv(accounts_path)
    acc = acc.drop(acc.index)
    acc = pd.concat([acc,bal_sheet[['Head','Debit']]])
    bal_sheet['Head']=bal_sheet['Head2']
    acc = pd.concat([acc, bal_sheet[['Head','Credit']]])
    acc.reset_index(drop=True, inplace=True)
    acc = acc.dropna(subset=['Debit', 'Credit'], how='all')
    acc['Head'] = np.where(acc['Head']=='Profit & Loss', '3100: Capital',acc['Head'])
    acc['Opening Bal']=0
    acc['code']=acc['Head'].str[0]
    acc['code']=np.where(acc['code']=='C','1',acc['code'])
    acc['code']=acc['code'].astype('int64')
    acc['Closing Bal']=np.where(acc['code']==1,np.where(acc['Debit'].notnull(), acc['Debit'], acc['Credit']*(-1))
                                ,np.where(acc['code'].isin([2,3]),np.where(acc['Credit'].notnull(),acc['Credit'],acc['Debit']*(-1))
                                                        ,np.nan))
    acc['Debit']=np.where(acc['Credit']<0,acc['Credit']*(-1),acc['Debit'])
    acc['Credit']=np.where(acc['Credit']<0,np.nan,acc['Credit'])
    acc['Credit']=np.where(acc['Debit']<0,acc['Debit']*(-1),acc['Credit'])
    acc['Debit']=np.where(acc['Debit']<0,np.nan,acc['Debit'])
    acc['Date']=f'7-1-{year2}'
    acc.to_csv(f'Arif Academy School Management System/static/xlscsv/accounts_{year2}_{year2+1}.csv',index=False)


def main_program():
    print("Running the main program...")
    connection=create_connection()
    cursor=connection.cursor()
    today=datetime.date.today()

    generate_records(cursor,today)
    filename=f"Arif Academy School Management System/dist/run/static/xlscsv/accounts_{today.year-1}_{int(today.year)}.csv"

    df=pd.read_csv(filename)
    
    df['Date']=pd.to_datetime(df['Date'])
    df['Month']=df['Date'].dt.month
    df['Year']=df['Date'].dt.year
    year2=today.year
    year1=year2-1
    trial_bals,income_statements,bal_sheets,cash_books=[],[],[],[]
    trial_bal,income_statement,bal_sheet, cash_book,sheet=create_income_statement(df, year1,year2,f'yearly',month=list(df['Month'].unique()))
    if not os.path.exists('reports_final'):
        os.makedirs('reports_final')
    file_path = f'reports_final/Balance_Sheet_{year1-1}_{year1}.xlsx'
    if os.path.exists(file_path):
        bal1=pd.read_excel(file_path,sheet_name='yearly')
        cashflows=generate_cashflows(bal1,bal_sheet, year1, year2)
        with pd.ExcelWriter(f'reports_final/Cash_Flows_{year1}_{year2}.xlsx') as writer:
            cashflows.to_excel(writer, sheet_name='cash', index=False)
    trial_bals.append((trial_bal,sheet))
    income_statements.append((income_statement,sheet))
    bal_sheets.append((bal_sheet,sheet))
    cash_books.append((cash_book,sheet))
    with pd.ExcelWriter(f'reports_final/Trial_Balance_{year1}_{year2}.xlsx') as writer:
        for i in trial_bals:
            i[0].to_excel(writer, sheet_name=i[1], index=False)
    with pd.ExcelWriter(f'reports_final/Income_Statement_{year1}_{year2}.xlsx') as writer:
        for i in income_statements:
            i[0].to_excel(writer, sheet_name=i[1], index=False)
    with pd.ExcelWriter(f'reports_final/Balance_Sheet_{year1}_{year2}.xlsx') as writer:
        for i in bal_sheets:
            i[0].to_excel(writer, sheet_name=i[1], index=False)
    with pd.ExcelWriter(f'reports_final/Cash_Book_{year1}_{year2}.xlsx') as writer:
        for i in cash_books:
            i[0][0].to_excel(writer, sheet_name=f"cash_{i[1]}", index=False)
            i[0][1].to_excel(writer, sheet_name=f"bank_{i[1]}", index=False)


    connection.commit()
    if 'connection' in locals() and connection.is_connected():
        cursor.close()
        connection.close()
    time.sleep(10)  # Wait for 10 seconds
    print("Main program completed.")

def run_if_needed():
    try:
        main_program()
    except Exception as e:
        print(f"An error occurred: {e}")
            # Don't update the state file, so it will run again on next startup

if __name__ == "__main__":
    run_if_needed()