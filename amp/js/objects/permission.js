export class Permission {
    constructor(id, level, authorId){
        this.id = parseInt(id);
        this.level = parseInt(level);
        this.authorId = parseInt(authorId);
        this.columnId;
    }
    insert(func){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/insertpermission.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = () => {
            try{
                this.id = JSON.parse(xhttp.responseText).newId;
                func(this); 
            } catch(err){
                console.log(err);
                console.log(xhttp.responseText);
            }
        }
    }
    change(func){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/changepermissiontype.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = () => {
            try{
                this.id = JSON.parse(xhttp.responseText).newId;
                func(this); 
            } catch(err){
                console.log(err);
                console.log(xhttp.responseText)
            }
        }
    }
}