import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeModel } from './models/employee';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-18-crud';
  employeeForm!: FormGroup;
  employeeDetails: EmployeeModel = new EmployeeModel();
  private localStorageKey: string = 'EmployeeData';
  employeeList: EmployeeModel[] = [];
  isEditing: boolean = false; // Track if editing mode is active
  editIndex: number | null = null; // Track the index of the employee being edited
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.initaliseFormData();
    const oldData = localStorage.getItem(this.localStorageKey);
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  initaliseFormData() {
    this.employeeForm = this.fb.group({
      empId: [this.employeeDetails.empId],
      name: [this.employeeDetails.name, [Validators.required]],
      city: [this.employeeDetails.city],
      state: [this.employeeDetails.state],
      emailId: [this.employeeDetails.emailId, [Validators.required]],
      contactNo: [
        this.employeeDetails.contactNo,
        [Validators.pattern('^[0-9]{10}$')],
      ],
      address: [this.employeeDetails.address],
      pinCode: [this.employeeDetails.pinCode],
    });
  }
  showToast(message: string, type: string): void {
    const toastElement = document.getElementById('toastMessage');
    if (toastElement) {
      toastElement.innerText = message;
      toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
  onEdit(item: EmployeeModel, index: number) {
    this.isEditing = true; // Activate edit mode
    this.editIndex = index; // Save the index of the item being edited
    this.employeeForm.setValue({ ...item }); // Populate the form with employee data

    // this.employeeForm.setValue({
    //   empId: item.empId,
    //   name: item.name,
    //   city: item.city,
    //   state: item.state,
    //   emailId: item.emailId,
    //   contactNo: item.contactNo,
    //   address: item.address,
    //   pinCode: item.pinCode,

    // })
  }
  // for error popup
  hasError = (controlName: string, errorName: string) => {
    // return this.employeeForm.controls[controlName].getError(errorName);
    const control = this.employeeForm.get(controlName);
    return control?.hasError(errorName) && (control.touched || control.dirty);
  };
  onReset() {
    this.employeeForm.reset();
    this.isEditing = false;
    this.editIndex = null;
  }

  onDelete(index: number, name: string) {
    if (confirm(`Are you sure? You want to delete this emloyee ${name}`)) {
      this.employeeList.splice(index, 1);
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.employeeList)
      ); // update local storage
      this.showToast('Employee deleted successfully!', 'danger');
    }
  }

  submitEmployeeForm() {
    if (!this.employeeForm.valid) {
      alert('Please fill out the form correctly');
    }

    const employeeData: EmployeeModel = {
      empId:
        this.isEditing && this.editIndex !== null
          ? this.employeeList[this.editIndex].empId
          : this.employeeList.length + 1,
      ...this.employeeForm.value,
    };

    if (this.isEditing && this.editIndex !== null) {
      this.employeeList[this.editIndex] = employeeData; // Update the employee
      alert('Employee updated successfully!');
    } else {
      this.employeeList.push(employeeData); // Add new employee
      alert('Employee added successfully!');
    }

    // Save to localStorage
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.employeeList)
    );

    // Reset the form and state
    this.onReset();
  }
  // submitEmployeeForm(){
  // if(this.employeeForm.valid){

  //   const newEmployee: EmployeeModel = {
  //     empId: this.employeeList.length + 1, // Increment ID based on the current list length
  //     name: this.employeeForm.value.name,
  //     city: this.employeeForm.value.city,
  //     state: this.employeeForm.value.state,
  //     emailId: this.employeeForm.value.emailId,
  //     contactNo: this.employeeForm.value.contactNo,
  //     address: this.employeeForm.value.address,
  //     pinCode: this.employeeForm.value.pinCode,
  //   };

  //   this.employeeList.push(newEmployee);
  //   localStorage.setItem(this.localStorageKey,JSON.stringify(this.employeeList));
  //   this.employeeForm.reset();

  // }else{
  //   alert("Please Fill The Form")
  // }
  // }

  // submitEmployeeForm(){
  // if(this.employeeForm.valid){
  // const oldData = localStorage.getItem(this.localStorageKey);
  // if(oldData != null){
  //   const parseData = JSON.parse(oldData);
  //   this.employeeForm.controls["empId"].setValue(parseData.length + 1);
  //   this.employeeList.unshift(this.employeeForm.value);
  // }else{
  //   this.employeeList.unshift(this.employeeForm.value);
  //   localStorage.setItem(this.localStorageKey,JSON.stringify(this.employeeList));
  // }

  // }else{
  //   alert("Please Fill The Form")
  // }
  // }
}
