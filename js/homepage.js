let empPayrollList;
window.addEventListener('DOMContentLoaded',(event)=>{
  if (site_properties.use_local_storage.match("true")) {
    getEmployeePayrollDataFromStorage();
  } else getEmployeePayrollDataFromServer();
}
);
const getEmployeePayrollDataFromStorage = () => {
    empPayrollList= localStorage.getItem('EmployeePayrollList') ? 
                        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];  
     processEmployeePayrollDataResponse();
  }
  const processEmployeePayrollDataResponse = () => {
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHTML();
    localStorage.removeItem("editEmp");
  };
  function getEmployeePayrollDataFromServer() {
  makeServiceCall("GET", site_properties.server_url, true)
    .then((responseText) => {
      empPayrollList = JSON.parse(responseText);
      processEmployeePayrollDataResponse();
    })
    .catch((error) => {
      console.log("GET Error Status: " + JSON.stringify(error));
      alert(error);
      empPayrollList = [];
      processEmployeePayrollDataResponse();
    });
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
                          <td><div class='dept-label'>${getDeptHtml([employeePayrollData._department])}</div>
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
const getDeptHtml = (deptList) => {
  let deptHtml = "";
  for (const dept of deptList) {
    deptHtml = `${deptHtml}<div class="dept-label">${dept}</div>`;
  }
  return deptHtml;
};
  const remove = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if (!empPayrollData) return;
    const index = empPayrollList
                  .map(empData => empData.id)
                  .indexOf(empPayrollData.id);
    empPayrollList.splice(index, 1);
    if(site_properties.use_local_storage.match("true")){
      localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));    
      document.querySelector(".emp-count").textContent = empPayrollList.length;
    }
    else{
      const deleteURL =
        site_properties.server_url + empPayrollData.id.toString();
      makeServiceCall("DELETE", deleteURL, true)
        .then((responseText) => {
          document.querySelector(".emp-count").textContent =
            empPayrollList.length;
        })
        .catch((error) => {
          console.log("DELETE Error Status: " + JSON.stringify(error));
        });
    }
 
    createInnerHTML();
  };
  const update = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if (!empPayrollData) return;
    localStorage.setItem("editEmp", JSON.stringify(empPayrollData))
    window.location.replace(site_properties.add_emp_payroll_page);
  };