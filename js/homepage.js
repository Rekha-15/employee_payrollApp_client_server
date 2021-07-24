let empPayrollList;
window.addEventListener('DOMContentLoaded',(event)=>{
    empPayrollList = getEmployeePayrollDataFromStorage();
  document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHTML();
    localStorage.removeItem("editEmp");
}
);
const getEmployeePayrollDataFromStorage = () => {
    return localStorage.getItem('EmployeePayrollList') ? 
                        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];  
  }
  

const createInnerHTML =()=>{
    const headerHTML=" <th></th><th>Name</th><th>Gender</th><th>Departments</th><th>Salary</th><th>StartDate</th>";
    let innerHTML=`${headerHTML}`;
    for(const employeePayrollData of empPayrollList ){
        innerHTML=` ${innerHTML}
                      <tr>
                          <td><img class="profile" src="${employeePayrollData._profilePic}"></td>
                          <td>${employeePayrollData._name}</td>
                          <td>${employeePayrollData._gender}</td>
                          <td><div class='dept-label'>${getDeptHtml(employeePayrollData._department)}</div>
                          <td>${stringifyDate(employeePayrollData._startDate)}</td>
                          <td>${employeePayrollData._salary}</td>
                          <td>
                              <img id="${employeePayrollData.id}" onclick="remove(this)" alt="delete" src="../assets/delete-black-18dp.svg">
                              <img id="${employeePayrollData.id}" onclick="update(this)" alt="edit" src="../assets/create-black-18dp.svg">
                          </td>
                      </tr>
        `;
    
        document.querySelector('#display').innerHTML=innerHTML;
    }  
}
const createEmployeePayrollJSON = () => {
    let empPayrollListLocal = [
      {       
        _name: 'Harish',
        _gender: 'male',
        _department: [
            'Engineering',
            'Finance'
        ],
        _salary: '500000',
        _startDate: '1 Nov 2020',
        _note: '',
        id: new Date().getTime(),
        _profilePic: '../assets/emp1.png'
      },
      {
        _name: 'Savita',
        _gender: 'female',
        _department: [
            'Sales'
        ],
        _salary: '400000',
        _startDate: '1 Nov 2020',
        _note: '',
        id: new Date().getTime() + 1,
        _profilePic: '../assets/emp4.png'
      }
    ];
    return empPayrollListLocal;
  }
  const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
    }
    return deptHtml;
  }
  const remove = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if (!empPayrollData) return;
    const index = empPayrollList
                  .map(empData => empData.id)
                  .indexOf(empPayrollData.id);
    empPayrollList.splice(index, 1);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHTML();
  }
  const update = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if (!empPayrollData) return;
    localStorage.setItem("editEmp", JSON.stringify(empPayrollData))
    window.location.replace(site_properties.add_emp_payroll_page);
}