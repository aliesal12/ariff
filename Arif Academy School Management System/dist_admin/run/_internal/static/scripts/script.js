// Get all buttons
const buttons = document.querySelectorAll(".button-container button");

// Get the first button
const button1 = document.getElementById("button1");

// Get the popup
const popup = document.getElementById("popup");

// Get the <span> element that closes the popup
const closeBtn = document.getElementsByClassName("close")[0];

// Add click event listeners to all buttons
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (index === 0) {
      popup.style.display = "block";
    } else if (index === 1) {
      fetch("/monthly_fee/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: index,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.result);
          alert(data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(data.result);
        });
    } else if (index === 2) {
      const paymentTypeDialog = document.getElementById("paymentTypeDialog");
      const paymentTypeForm = document.getElementById("paymentTypeForm");
      const cancelButton = document.getElementById("cancelPaymentType");

      paymentTypeDialog.style.display = "block";

      paymentTypeForm.onsubmit = (e) => {
        e.preventDefault();
        const paymentType = document.querySelector(
          'input[name="paymentType"]:checked'
        ).value;
        paymentTypeDialog.style.display = "none";
        const name = prompt("Enter Student Name:");
        const reg = prompt("Enter Student Registration Number:");
        if (reg != null) {
          var regex = /^(?:[0-9]|1[0-2])$/;
          do {
            adv_month = prompt(
              "Number of Months advanced is being paid for (0-12):"
            );
          } while (
            !regex.test(adv_month) &
            (adv_month != "") &
            (adv_month != null)
          );
          regex = /^\d+$/;
          if (adv_month != null) {
            do {
              console.log("hello");
              var adv_payment = prompt("Enter Advanced amount being paid:");
            } while (
              !regex.test(adv_payment) &
              (adv_payment != "") &
              (adv_payment != null)
            );
            if (adv_payment != null) {
              do {
                var add_payment = prompt("Enter Any additional Payment:");
              } while (
                !regex.test(add_payment) &
                (add_payment != "") &
                (add_payment != null)
              );
              if (add_payment != null) {
                do {
                  var total_amount = prompt("Enter Total Amount paid:");
                } while (!regex.test(total_amount) & (total_amount != null));
                if (total_amount != null) {
                  var regex = /^(1[0-2]|[1-9])(,(1[0-2]|[1-9]))*$/;
                  ;
                  do {
                    var month_spe = prompt(
                      "Enter the month/s, advance being paid for:"
                    );
                  } while (
                    !regex.test(month_spe) &
                    (adv_month != "") &
                    (adv_month != null)
                  );
                  if (month_spe != null) {
                    fetch("/fee_payment/api", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        NAME: name,
                        REG: reg,
                        Advanced_month: adv_month,
                        advanced_payment: adv_payment,
                        Total: total_amount,
                        Cash_Bank: paymentType,
                        Additional: add_payment,
                        month_spe: month_spe,
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        console.log(data.result);
                        alert(data.result);
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      });
                  }
                }
              }
            }
          }
        }
      };
      cancelButton.onclick = () => {
        paymentTypeDialog.style.display = "none";
      };
      window.onclick = (event) => {
        if (event.target == paymentTypeDialog) {
          paymentTypeDialog.style.display = "none";
        }
      };
    } else if (index === 3) {
      var sec = prompt("Enter Admin password:");
      if (sec == "0033") {
        var regex = /^\d{5}-\d{7}-\d$/;
        do {
          var cnic = prompt("Enter Teacher CNIC:");
        } while (!regex.test(cnic) & (cnic != null));
        regex = /^\d+$/;
        if (cnic != null) {
          do {
            var attendance = prompt("Enter Attendance:");
          } while (!regex.test(attendance) & (attendance != null));
          do {
            var att_allowance = prompt("Enter Attendance Allowance:");
          } while (!regex.test(att_allowance) & (att_allowance != null));
          if (att_allowance != null) {
            do {
              var med_allowance = prompt("Enter Medical Allowance:");
            } while (!regex.test(med_allowance) & (med_allowance != null));
            if (med_allowance != null) {
              do {
                var eidi = prompt("Enter Eidi/Special Bonus:");
              } while (!regex.test(eidi) & (eidi != null));
              if (eidi != null) {
                do {
                  var adv = prompt("Enter Advanced Payment:");
                } while (!regex.test(adv) & (adv != null));
                if (adv != null) {
                  do {
                    var add_payment = prompt("Enter Additional Payment:");
                  } while (!regex.test(add_payment) & (add_payment != null));
                  regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

                  console.log(add_payment);
                    console.log("Hello")
                    do {
                      var date = prompt("Enter Date of payment(YYYY-MM-DD):");
                    } while (!regex.test(date) & (date != null));
                    if (date != null) {
                      console.log("here");
                      fetch("/salary_payment/api", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          CNIC: cnic,
                          MEDICAL: med_allowance,
                          Eidi: eidi,
                          ADVANCED: adv,
                          ADDITIONAL: add_payment,
                          Att_allow: att_allowance,
                          date: date,
                          attendace: attendance,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log(data.result);
                          alert(data.result);
                        })
                        .catch((error) => {
                          console.error("Error:", error);
                        });
                    }
                }
              }
            }
          }
        }
      }
      else{
        alert('Wrong Password')
      }
    } else if (index === 4) {
      fetch("/misc_expense2/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const expenseDialog = document.getElementById("expenseDialog");
          const expenseSections = document.getElementById("expenseSections");

          // Clear previous content
          Object.keys(data).forEach((category) => {
            const sectionId = `${category.toLowerCase()}Section`;
            const section = document.getElementById(sectionId);
            const list = section.querySelector(".expense-list");
            list.innerHTML = "";

            data[category].forEach((item) => {
              const expenseItem = document.createElement("div");
              expenseItem.classList.add("expense-item");
              expenseItem.textContent = item;

              expenseItem.addEventListener("click", () => {
                const paymentTypeDialog = document.getElementById(
                  "paymentTypeDialog"
                );
                const paymentTypeForm = document.getElementById(
                  "paymentTypeForm"
                );
                const cancelButton = document.getElementById(
                  "cancelPaymentType"
                );

                paymentTypeDialog.style.display = "block";

                paymentTypeForm.onsubmit = (e) => {
                  e.preventDefault();
                  const paymentType = document.querySelector(
                    'input[name="paymentType"]:checked'
                  ).value;
                  paymentTypeDialog.style.display = "none";
                  regex = /^\d+$/;
                  do {
                    var amount = prompt(`Enter amount for ${item}:`);
                  } while (!regex.test(amount) & (amount != null));
                  if (amount != null) {
                    fetch("/misc_expense_post/api", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        head: item,
                        amount: amount,
                        category: category,
                        paymentType: paymentType,
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        console.log(data.result);
                        alert(data.result);
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      });
                  }
                };

                cancelButton.onclick = () => {
                  paymentTypeDialog.style.display = "none";
                };

                window.onclick = (event) => {
                  if (event.target == paymentTypeDialog) {
                    paymentTypeDialog.style.display = "none";
                  }
                };
              });
              list.appendChild(expenseItem);
            });
          });

          expenseDialog.style.display = "block";

          const closeBtn = expenseDialog.querySelector(".close");
          closeBtn.onclick = function () {
            expenseDialog.style.display = "none";
          };

          window.onclick = function (event) {
            if (event.target == expenseDialog) {
              expenseDialog.style.display = "none";
            }
          };
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (index === 5) {
      fetch("/misc_expense2/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const expenseDialog = document.getElementById("expenseDialog");
          const expenseSections = document.getElementById("expenseSections");

          // Clear previous content
          Object.keys(data).forEach((category) => {
            const sectionId = `${category.toLowerCase()}Section`;
            const section = document.getElementById(sectionId);
            const list = section.querySelector(".expense-list");
            list.innerHTML = "";

            data[category].forEach((item) => {
              const expenseItem = document.createElement("div");
              expenseItem.classList.add("expense-item");
              expenseItem.textContent = item;

              expenseItem.addEventListener("click", () => {

                  regex = /^\d+$/;
                  do {
                    var amount = prompt(`Enter amount for ${item}:`);
                  } while (!regex.test(amount) & (amount != amount));
                  if (amount !== null) {
                    fetch("/general_voucher/api", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        head: item,
                        amount: amount,
                        category: category,
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        console.log(data.result);
                        alert(data.result);
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      });
                  }
              });
              list.appendChild(expenseItem);
            });
          });

          expenseDialog.style.display = "block";

          const closeBtn = expenseDialog.querySelector(".close");
          closeBtn.onclick = function () {
            expenseDialog.style.display = "none";
          };

          window.onclick = function (event) {
            if (event.target == expenseDialog) {
              expenseDialog.style.display = "none";
            }
          };
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (index == 6) {
      fetch("/generate_records/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Index: index,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.result);
          alert(data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (index == 7) {
      fetch("/upload_xls/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Index: index,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.result);
          alert(data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (index === 8) {
      const addRemoveDialog = document.getElementById("addRemoveDialog");
      const addRemoveForm = document.getElementById("addRemoveForm");
      const cancelButton = document.getElementById("cancelAddRemove");

      addRemoveDialog.style.display = "block";

      addRemoveForm.onsubmit = (e) => {
        e.preventDefault();
        const action = document.querySelector('input[name="action"]:checked')
          .value;
        addRemoveDialog.style.display = "none";
        console.log(action);
        if (action === "add") {
          const categorySelectionDialog = document.getElementById(
            "categorySelectionDialog"
          );
          const categorySelectionForm = document.getElementById(
            "categorySelectionForm"
          );
          const cancelCategorySelectionButton = document.getElementById(
            "cancelCategorySelection"
          );

          categorySelectionDialog.style.display = "block";

          categorySelectionForm.onsubmit = (e) => {
            e.preventDefault();
            const category = document.querySelector(
              'input[name="category"]:checked'
            ).value;
            categorySelectionDialog.style.display = "none";

            const account = prompt(`Enter new account for ${category}:`);
            if (account) {
              fetch("/chart/api", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  head: category,
                  category: category,
                  action: action,
                  account: account,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data.result);
                  alert(data.result);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          };

          cancelCategorySelectionButton.onclick = () => {
            categorySelectionDialog.style.display = "none";
          };

          window.onclick = (event) => {
            if (event.target == categorySelectionDialog) {
              categorySelectionDialog.style.display = "none";
            }
          };
        } else {
          const account = "0";

          fetch("/misc_expense2/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              const expenseDialog = document.getElementById("expenseDialog");
              const expenseSections = document.getElementById(
                "expenseSections"
              );

              // Clear previous content
              Object.keys(data).forEach((category) => {
                const sectionId = `${category.toLowerCase()}Section`;
                const section = document.getElementById(sectionId);
                const list = section.querySelector(".expense-list");
                list.innerHTML = "";

                data[category].forEach((item) => {
                  const expenseItem = document.createElement("div");
                  expenseItem.classList.add("expense-item");
                  expenseItem.textContent = item;

                  expenseItem.addEventListener("click", () => {
                    fetch("/chart/api", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        head: item,
                        category: category,
                        action: action,
                        account: account,
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        console.log(data.result);
                        alert(data.result);
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      });
                  });
                  list.appendChild(expenseItem);
                });
              });

              expenseDialog.style.display = "block";

              const closeBtn = expenseDialog.querySelector(".close");
              closeBtn.onclick = function () {
                expenseDialog.style.display = "none";
              };

              window.onclick = function (event) {
                if (event.target == expenseDialog) {
                  expenseDialog.style.display = "none";
                }
              };
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      };

      cancelButton.onclick = () => {
        addRemoveDialog.style.display = "none";
      };

      window.onclick = (event) => {
        if (event.target == addRemoveDialog) {
          addRemoveDialog.style.display = "none";
        }
      };
    } else {
      alert(`You clicked Button ${index + 1}`);
    }
  });
});

// When the user clicks on <span> (x), close the popup
closeBtn.onclick = function () {
  popup.style.display = "none";
};

// When the user clicks anywhere outside of the popup, close it
window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

// Get the clickable text
const clickableText = document.querySelector('.clickable-text');
const reportOptionsDialog = document.getElementById('reportOptionsDialog');
const reportOptionsForm = document.getElementById('reportOptionsForm');
const cancelReportOptions = document.getElementById('cancelReportOptions');
const timeValueInput = document.getElementById('timeValue');
const errorMessage = document.getElementById('errorMessage');

clickableText.addEventListener('click', () => {
  reportOptionsDialog.style.display = 'block';
});

cancelReportOptions.addEventListener('click', () => {
  reportOptionsDialog.style.display = 'none';
  reportOptionsForm.reset();
  errorMessage.textContent = '';
});

reportOptionsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const timeUnit = document.querySelector('input[name="timeUnit"]:checked').value;
  const timeValue = parseInt(timeValueInput.value);

  if (timeUnit === 'days' && (timeValue < 0 || timeValue > 31)) {
    errorMessage.textContent = 'Please enter a number between 0 and 31 for days.';
    return;
  }

  if (timeUnit === 'months' && (timeValue < 1 || timeValue > 12)) {
    errorMessage.textContent = 'Please enter a number between 1 and 12 for months.';
    return;
  }

  // If validation passes, close the dialog and make the API call
  reportOptionsDialog.style.display = 'none';
  errorMessage.textContent = '';

  fetch("/generate_report/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      INDEX: 4,
      d_m: timeUnit,
      val: timeValue
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.result);
      alert(data.result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Add input validation for the time value
timeValueInput.addEventListener('input', () => {
  const timeUnit = document.querySelector('input[name="timeUnit"]:checked')?.value;
  const timeValue = parseInt(timeValueInput.value);

  if (timeUnit === 'days') {
    if (timeValue < 0 || timeValue > 31) {
      errorMessage.textContent = 'Please enter a number between 0 and 31 for days.';
    } else {
      errorMessage.textContent = '';
    }
  } else if (timeUnit === 'months') {
    if (timeValue < 1 || timeValue > 12) {
      errorMessage.textContent = 'Please enter a number between 1 and 12 for months.';
    } else {
      errorMessage.textContent = '';
    }
  }
});

// Update validation when time unit changes
document.querySelectorAll('input[name="timeUnit"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const event = new Event('input');
    timeValueInput.dispatchEvent(event);
  });
});

// Change button color on hover
buttons.forEach((button) => {
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#e0e0e0";
  });
  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#fff";
  });
});

// Add keyboard navigation
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key >= "1" && key <= "8") {
    const index = parseInt(key) - 1;
    buttons[index].click();
  }
});
const teacherButton = document.getElementById("teacherButton");
const teacherPopup = document.getElementById("teacherPopup");
const overlay = document.createElement("div");

const studentButton = document.getElementById("studentButton");
const studentPopup = document.getElementById("studentPopup");

overlay.className = "overlay";
document.body.appendChild(overlay);

teacherButton.addEventListener("click", () => {
  teacherPopup.style.display = "block";
  popup.classList.add("frozen");
  overlay.style.display = "block";
});

studentButton.addEventListener("click", () => {
  studentPopup.style.display = "block";
  popup.classList.add("frozen");
  overlay.style.display = "block";
});

const closeTeacherPopup = teacherPopup.querySelector(".close");
closeTeacherPopup.onclick = function () {
  teacherPopup.style.display = "none";
  popup.classList.remove("frozen");
  overlay.style.display = "none";
};

const closeStudentPopup = studentPopup.querySelector(".close");
closeStudentPopup.onclick = function () {
  studentPopup.style.display = "none";
  popup.classList.remove("frozen");
  overlay.style.display = "none";
};

// When the user clicks anywhere outside of the teacher popup, close it
window.addEventListener("click", (event) => {
  if (event.target == overlay) {
    teacherPopup.style.display = "none";
    popup.classList.remove("frozen");
    overlay.style.display = "none";
  }
});

window.addEventListener("click", (event) => {
  if (event.target == overlay) {
    studentPopup.style.display = "none";
    popup.classList.remove("frozen");
    overlay.style.display = "none";
  }
});

// Add functionality to teacher popup buttons
const teacherPopupButtons = teacherPopup.querySelectorAll(".popup-button");
teacherPopupButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const code=alert('Enter admin passcode: ')
    if (code=='0033'){
    var regex = /^\d{5}-\d{7}-\d$/;
    do {
      var cnic = prompt("Enter Teacher CNIC(DDDDD-DDDDDDD-D):");
    } while (!regex.test(cnic) & (cnic != null));
    do {
      var new_cnic = prompt(
        "Enter new CNIC (if applicable, leave blank if not):"
      );
    } while (!regex.test(new_cnic) & (new_cnic != null) & (new_cnic != ""));
    if (cnic != null) {
      const name = prompt(
        "Enter Teacher Name (Leave blank if not applicable):"
      );
      regex = /^\d+$/;
      do {
        var salary = prompt(
          "Enter Teacher Salary (Leave blank if not applicable):"
        );
      } while (!regex.test(salary) & (salary != null) & (salary != ""));
      regex = /^\d{4}-\d{7}$/;
      do {
        var contact = prompt(
          "Enter Teacher Contact(DDDD-DDDDDDD) (Leave blank if not applicable):"
        );
      } while (!regex.test(contact) & (contact != null) & (contact != ""));
      regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
      do {
        var doj = prompt(
          "Enter Teacher Date of Joining (YYYY-MM-DD) (Leave blank if not applicable):"
        );
      } while (!regex.test(doj) & (doj != null) & (doj != ""));
      if (
        (new_cnic != null) &
        (name != null) &
        (salary != null) &
        (contact != null) &
        (doj != null)
      ) {
        fetch("/teacher_data_update_delete/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CNIC: cnic,
            newcnic: new_cnic,
            NAME: name,
            SAL: salary,
            CONTACT: contact,
            DOJ: doj,
            INDEX: index,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.result);
            alert(data.result);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
 }
else{
  alert("Invalid passcode!!!")
}});
});

const studentPopupButtons = studentPopup.querySelectorAll(".popup-button");
studentPopupButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const name = prompt("Enter Student Name (Leave blank if not applicable):");
    const fname = prompt(
      "Enter Student Father Name (Leave blank if not applicable):"
    );
    const reg = prompt("Enter Student's Registration Number:");
    const grno = prompt("Enter Student GR no (Leave blank if not applicable):");
    var regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    do {
      var dob = prompt(
        "Enter Student Date of Birth (YYYY-MM-DD) (Leave blank if not applicable):"
      );
    } while (!regex.test(dob) & (dob != null) & (dob != ""));

    regex = /^\d{4}-\d{7}$/;
    do {
      var contact = prompt(
        "Enter Student Contact(DDDD-DDDDDDD) (Leave blank if not applicable):"
      );
    } while (!regex.test(contact) & (contact != null) & (contact != ""));
    do {
      var contact2 = prompt(
        "Enter Student Alternate Contact(DDDD-DDDDDDD) (Leave blank if not applicable):"
      );
    } while (!regex.test(contact2) & (contact2 != null) & (contact2 != ""));

    regex = /^\d+$/;
    do {
      var admission_fee = prompt(
        "Enter Student Admission Fees (Leave blank if not applicable):"
      );
    } while (
      !regex.test(admission_fee) &
      (admission_fee != null) &
      (admission_fee != "")
    );
    do {
      var annual_fund = prompt(
        "Enter Student Annual Fund (Leave blank if not applicable):"
      );
    } while (
      !regex.test(annual_fund) &
      (annual_fund != null) &
      (annual_fund != "")
    );
    do {
      var fee = prompt(
        "Enter Student Monthly Fee (Leave blank if not applicable):"
      );
    } while (!regex.test(fee) & (fee != null) & (fee != ""));
    var regex = /^\d{5}-\d{7}-\d$/;
    do {
      var b_form = prompt(
        "Enter Student B_Form Number (Leave blank if not applicable):"
      );
    } while (!regex.test(b_form) & (b_form != null) & (b_form != ""));
    var classs = prompt("Enter Student Class (Leave blank if not applicable):");
    do {
      var ann_stat = prompt("Annual Fund (Paid/Unpaid)?:");
    } while (
      (ann_stat != "Unpaid") &
      (ann_stat != "Paid") &
      (ann_stat != null) &
      (ann_stat != "")
    );
    do {
      var adm_stat = prompt("Admission Fee (Paid/Unpaid)?:");
    } while (
      (adm_stat != "Unpaid") &
      (adm_stat != "Paid") &
      (adm_stat != null) &
      (adm_stat != "")
    );
    if (
      (adm_stat != null) &
      (ann_stat != null) &
      (reg != null) &
      (name != null) &
      (fname != null) &
      (grno != null) &
      (dob != null) &
      (contact != null) &
      (contact2 != null) &
      (admission_fee != null) &
      (annual_fund != null) &
      (b_form != null) &
      (fee != null) &
      (classs != null)
    ) {
      fetch("/student_data_update_delete/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          REG: reg,
          NAME: name,
          FNAME: fname,
          GRNO: grno,
          DOB: dob,
          CONTACT: contact,
          alt: contact2,
          admission: admission_fee,
          annual: annual_fund,
          B_FORM: b_form,
          Fee: fee,
          CLASS: classs,
          Annual_status: ann_stat,
          Admission_status: adm_stat,
          INDEX: index,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.result);
          alert(data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
});

// Prevent clicks on the overlay from closing both popups
overlay.addEventListener("click", (event) => {
  event.stopPropagation();
});

// const popupButtons = document.querySelectorAll(".popup-button");
// popupButtons.forEach((button, index) => {
//   button.addEventListener("click", () => {
//     alert(`You clicked New Button ${index + 1}`);
//     fetch("/teacher_data/api", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ buttonIndex: index }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data.result);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   });
// });

/*fetch("/cash_payments/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const expenseDialog = document.getElementById("expenseDialog");
          const expenseList = document.getElementById("expenseList");
          expenseList.innerHTML = "";
          console.log(data);
          data.forEach((expense, i) => {
            const expenseItem = document.createElement("div");
            expenseItem.classList.add("expense-item");
            expenseItem.innerHTML = `
              <strong>Expense Type:</strong> ${expense.expense_type}<br>
              <strong>Total Amount Due:</strong> $${expense.total_amount_due.toFixed(
                2
              )}<br>
              <strong>Amount Paid:</strong> $${expense.amount_paid.toFixed(2)}
            `;
            expenseItem.addEventListener("click", () => {
              const amount = prompt(
                `Enter amount to pay for ${expense.expense_type}:`
              );
              if (amount !== null) {
                // Here you would typically send this data back to the server
                fetch("/cash_payments_post/api", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    type: expense.expense_type,
                    paid_already: expense.amount_paid,
                    due: expense.total_amount_due,
                    amount_paid: amount,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data.result);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }
            });
            expenseList.appendChild(expenseItem);
          });

          expenseDialog.style.display = "block";

          const closeBtn = expenseDialog.querySelector(".close");
          closeBtn.onclick = function () {
            expenseDialog.style.display = "none";
          };

          window.onclick = function (event) {
            if (event.target == expenseDialog) {
              expenseDialog.style.display = "none";
            }
          };
        })
        .catch((error) => {
          console.error("Error:", error);
        });*/
/*const type = prompt("Enter Type of Payment (Bill, Loan, etc):");
      const amount = prompt("Enter amount: ");
      fetch("/misc_expense/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          amount: amount,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });*/
