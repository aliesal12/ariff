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
import datetime

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

def update_state():
    with open('last_run_state.txt', 'w') as f:
        f.write(datetime.date.today().strftime('%Y-%m-%d'))

def generate_new(row,cursor,today):
    if (row['status'] in ['Unpaid','None']):
        row['Dues']=float(row['Monthly_fee'])+float(row['Dues'])-float(row['amount_paid'])
        row['status']='Unpaid'
    elif(row['status']=='Paid'):
        if row['advance_payments_last']>0:
            amount=row['Monthly_fee']-row['advance_payments_last']
        else:
            amount=row['Monthly_fee']-row['advance_payment']
        if amount>0:
            row['advance_payments_last']=0
            row['Dues']=amount
            row['status']='Unpaid'
        elif amount<0:
            row['advanced_payments_last']= -1 * amount
            row['Dues']=0
            row['status']='Paid'
        else:
            row['advance_payments_last']=0
            row['Dues']=0
            row['status']='Paid'
    
    if row['advance_months']>0:
        row['advance_months']-=1
    else:
        row['advance_months']=0
    
    id=str(row['Reg_No'])
    id=id.replace('/','')
    id=id.replace('-','')
    month=int(today.month)
    year=int(today.year)
    due_date=datetime.date(year,month,10)
    today=str(today).replace('-','')
    id=id+today
    query=f'("{id}",DATE "{due_date}",{row['Dues']}, "{row['status']}","{row['Reg_No']}",{row['advance_months']},{row['advance_payment']},{month},0,{row['advance_payments_last']}, NULL),'
    #cursor.execute(f'INSERT INTO fee VALUES("{id}",DATE "{due_date}",{row['Dues']}, "{row['status']}","{row['Reg_No']}",{row['advance_months']},{row['advance_payment']},{month},0,{row['advance_payments_last']}, NULL);')
    today=datetime.date.today()
    if int(today.month)>6:
        filename=f"dist/run/static/xlscsv/accounts_{today.year}_{int(today.year)+1}.csv"
    else:
        filename=f"dist/run/static/xlscsv/accounts_{today.year-1}_{int(today.year)}.csv"
    df=pd.read_csv(filename)
    data_df=row
    print(data_df['paid'])
    if data_df['paid']==False:
        open=get_close(df[df['Head']=='1220: Fee Receivable'])
        open2=get_close(df[df['Head']=='4010: Tuition Fee Income'])
        close=open+int(data_df['Monthly_fee'])
        close2=open2+int(data_df['Monthly_fee'])
        new={"Date":[today,today], "Head":['1220: Fee Receivable','4010: Tuition Fee Income'],"Debit":[data_df['Monthly_fee'],None],"Credit":[None,data_df['Monthly_fee']],'Opening Bal':[open,open2],'Closing Bal':[close,close2]}
    else:
        open=get_close(df[df['Head']=='2200: Advanced Fee Received'])
        open2=get_close(df[df['Head']=='4010: Tuition Fee Income'])
        close=open-int(data_df['feeee'])
        close2=open2+int(data_df['feeee'])
        new={"Date":[today,today], "Head":['2200: Advanced Fee Received','4010: Tuition Fee Income'],"Debit":[data_df['feeee'],None],"Credit":[None,data_df['feeee']],'Opening Bal':[open,open2],'Closing Bal':[close,close2]}
    #new={"Date":[today,today], "Head":['1210: Accounts Receivable','4020: Annual Fund Income'],"Debit":[data_df['Monthly_fee'],None],"Credit":[None,data_df['Monthly_fee']]}
    df=pd.concat([df,pd.DataFrame(new)],axis=0)
    df.to_csv(filename, index=False)
    return query

def get_close(temp):
    if len(temp)>0:
        open=int(temp.iloc[-1,5])
    else:
        open=0
    return open

def run_queries(df, cursor, connection):
    query='INSERT INTO fee VALUES '
    dff=df.copy()
    dff=dff.reset_index(drop=True)
    if 'connection' in locals() and connection.is_connected():
        connection.commit()
        cursor.close()
        connection.close()
    connection=create_connection()
    cursor=connection.cursor()
    print(dff.columns)
    for i in range(len(dff)):
        query=query+str(dff.iloc[i,11])
    query=query[:-1]+';'
    cursor.execute(query)
    return cursor, connection

def fee_adjustment(data_df, cursor, today,connection, monthfee=True):
    data_df['advance_payment']=np.where(data_df['advance_payment']=='None','0',data_df['advance_payment'])
    data_df['advance_payment']=data_df['advance_payment'].astype('int64')
    data_df['amount_paid']=np.where(data_df['amount_paid']=='None','0',data_df['amount_paid'])
    data_df['amount_paid']=data_df['amount_paid'].astype('int64')
    data_df['Dues']=np.where(data_df['Dues']=='None','0',data_df['Dues'])
    data_df['Dues']=data_df['Dues'].astype('int64')
    data_df['advance_payments_last']=np.where(data_df['advance_payments_last']=='None','0',data_df['advance_payments_last'])
    data_df['advance_payments_last']=data_df['advance_payments_last'].astype('int64')
    data_df['advance_months']=np.where(data_df['advance_months']=='None','0',data_df['advance_months'])
    data_df['advance_months']=data_df['advance_months'].astype('int64')
    data_df['feeee']=data_df['Monthly_fee'].astype('int64')
    data_df=data_df.reset_index(drop=True)
    data_df=data_df.fillna(0)
    data_df['query']=data_df.apply(lambda row: generate_new(row, cursor,today),axis=1)
    end=int(len(data_df)/30)+1
    for i in range(end):
        if (i+1)*30>len(data_df):
            cursor, connection=run_queries(data_df.iloc[i*30:], cursor, connection)
        else:
            cursor, connection=run_queries(data_df.iloc[i*30:(i+1)*30], cursor, connection)
    if 'connection' in locals() and connection.is_connected():
        connection.commit()
        cursor.close()
        connection.close()

def main_program():
    print("Running the main program...")
    connection=create_connection()
    cursor=connection.cursor()
    today=datetime.date.today()
    month=int(today.month)
    if (month==1):
        month=12
    else:
        month=month-1
    monyear=str(int(today.month))+'-'+str(today.year)
    cursor.execute(f'SELECT Registration_no FROM fee WHERE advance_specific_month LIKE "%{monyear}%";')
    data=cursor.fetchall()
    reglist=[str(i[0]) for i in data]
    cursor.execute(f'SELECT s.Registration_no, s.Month_Fees, f.Dues, f.advance_payment, f.amount_paid, f.Status, f.advance_payments_last,f.advance_months, f.advance_specific_month FROM students s LEFT JOIN (SELECT * FROM fee WHERE month={month}) f ON s.Registration_No=f.Registration_No;')
    data=cursor.fetchall()
    data_df=pd.DataFrame({"Reg_No":[str(i[0]) for i in data], "Monthly_fee":[str(i[1]) for i in data], 
                    "Dues":[str(i[2]) for i in data],"advance_payment":[str(i[3]) for i in data],
                    "amount_paid":[str(i[4]) for i in data],"status":[str(i[5]) for i in data],
                    'advance_payments_last':[str(i[6]) for i in data],'advance_months':[str(i[7]) for i in data],'advance_specific_month':[str(i[7]) for i in data]})
    data_df['paid']=np.where(data_df['Reg_No'].isin(reglist), True, False)
    data_df['feeee']=data_df['Monthly_fee']
    data_df['Monthly_fee']=np.where(data_df['Reg_No'].isin(reglist), '0', data_df['Monthly_fee'])
    fee_adjustment(data_df, cursor, today, connection)

    time.sleep(10)  # Wait for 10 seconds
    print("Main program completed.")
    

def run_if_needed():
    try:
        main_program()
        update_state()
    except Exception as e:
        print(f"An error occurred: {e}")
        # Don't update the state file, so it will run again on next startup

if __name__ == "__main__":
    run_if_needed()