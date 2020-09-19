/* event handler to fetch all data from database on page load 
or if there is no data in database the "no data" will be displayed*/
document.addEventListener('DOMContentLoaded', function(){
    
    fetch('http://localhost:5500/getAll')     // read API fetch call
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});
// event handler to update and delete 
document.querySelector('table tbody').addEventListener('click',function(event){
    
    if(event.target.className === "delete-row-btn"){
        //console.log(event.target);}
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn"){
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

/* onclick event to search data into table in database */
searchBtn.onclick = function(){

    const searchValue = document.querySelector('#search-input').value;
    
    fetch('http://localhost:5500/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

}

function deleteRowById(id){
    fetch('http://localhost:5500/delete/' + id, {
        headers: { 
            'Content-type' : 'application/json'
        },
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
}
 function handleEditRow(id){
     const updateSection = document.querySelector('#update-row');
     updateSection.hidden = false;
     document.querySelector('#update-row-btn').dataset.id = id;
 }
/* onclick event to partially update data into table in database */
 updateBtn.onclick = function(){
    const updateNameInput = document.querySelector('#update-name-input');
    const updateId= document.querySelector('#update-row-btn').dataset.id;
    
    fetch('http://localhost:5500/update/'+updateId,{
        method: 'PATCH',
        headers: { 
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateId,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
 }

 /* onclick event to add new data into table in database */
const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function(){

    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5500/insert', {  //  API fetch call
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name : name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}
 
    function insertRowIntoTable(data){
        const table = document.querySelector('table tbody');
        const isTableData = table.querySelector('.no-data'); 
    
        let tableHtml = "<tr>";
    
        for(var key in data){
            if(data.hasOwnProperty(key)) {
                if(key === 'dateAdded') {
                    data[key] = new Date(data[key]).toLocaleDateString();
                }
                tableHtml += `<td>${data[key]}</td>`;
                }
            }
        
        tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;
    
        tableHtml += "</tr>";
    
        if(isTableData){
            table.innerHTML = tableHtml;
        }else{  
            const newRow = table.insertRow();
            newRow.innerHTML = tableHtml;
         }
    
    }
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
//executes if table has no data
    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    // executes if table has some data
    let tableHtml = "";
    data.forEach(function({id,name,date_added}){
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleDateString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
