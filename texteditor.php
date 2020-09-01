<?php
    
 ?>
<!DOCTYPE html>
<html>
    <head>
        <title>Rich text editor</title>
        <script src="https://kit.fontawesome.com/2eba930695.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </head>
    <body onload="enableEditMode();">
        <div>
            <button onclick="execCmd('bold');"><i class="fas fa-bold"></i></button>
            <button onclick="execCmd('italic');"><i class="fas fa-italic"></i></button>
            <button onclick="execCmd('underline');"><i class="fas fa-underline"></i></button>
            <button onclick="execCmd('strikeThrough');"><i class="fas fa-strike-through"></i></button>   
            <button onclick="execCmd('justifyLeft');"><i class="fas fa-align-left"></i></button>
            <button onclick="execCmd('justifyCenter');"><i class="fas fa-align-center"></i></button>
            <button onclick="execCmd('justifyRight');"><i class="fas fa-align-right"></i></button>
            <button onclick="execCmd('justifyFull');"><i class="fas fa-align-justify"></i></button>
            <button onclick="execCmd('cut');"><i class="fas fa-cut"></i></button>
            <button onclick="execCmd('copy');"><i class="fas fa-copy"></i></button>
            <button onclick="execCmd('indent');"><i class="fas fa-indent"></i></button>
            <button onclick="execCmd('outdent');"><i class="fas fa-dedent"></i></button>
            <button onclick="execCmd('subscript');"><i class="fas fa-subscript"></i></button>
            <button onclick="execCmd('superscript');"><i class="fas fa-supersubscript"></i></button>
            <button onclick="execCmd('undo');"><i class="fas fa-undo"></i></button>
            <button onclick="execCmd('redo');"><i class="fas fa-repeat"></i></button>
            <button onclick="execCmd('insertUnorderedList');"><i class="fas fa-list-ul"></i></button>
            <button onclick="execCmd('insertOrderedList');"><i class="fas fa-list-ol"></i></button>
            <button onclick="execCmd('insertParagraph');"><i class="fas fa-paragraph"></i></button>            
            <select onchange="execCommandWithArg('formatBlock', this.value);" >
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
            </select>
            <button onclick="execCmd('insertHorizontalRule');">HR</button>
            <button onclick="execCommandWithArg('createLink', prompt('Enter a URL', 'http://'));"><i class="fas fa-link"></i></button>
            <button onclick="execCmd('unlink');"><i class="fas fa-unlink"></i></button>
            <button onclick="toggleSource('toggleSource');"><i class="fas fa-code"></i></button>
            <button onclick="toggleEdit();">Toggle Edit</button>
            <br/>
            <select onchange="execCommandWithArg('fontName', this.value);" >
                <option value="Arial">Arial</option>
                <option value="Comain Sans">Comain Sans</option>
                <option value="Courier">Courier</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
            </select>
            <select onchange="execCommandWithArg('fontSize', this.value);" >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
            </select>
            Fore Color: <input type="color" onchange="execCommandWithArg('foreColor', this.value);" >
            Background Color: <input type="color" onchange="execCommandWithArg('hiliteColor', this.value);" >
            <button onclick="execCommandWithArg('insertImage', prompt('Enter the image URL', ''));" ><i class="fa fa-file-image-o"></i></button>
            <button onclick="execCmd('selectAll');">Select All</button>
        </div>
        
        <iframe value="texts" id="txtField" name="richTextField" style="width: 1000px; height: 500px;"></iframe>

            <form method="post" action="tester.php">
                
               <!--  <input type="text" name="studentname"> -->
                <button type="submit" id="submit">Save</button>
            </form>    

        <script>
            $(document).ready(function() {


                $('#submit').click(function(e){
                    e.preventDefault();

                    //alert($("#txtField").contents().find("body").html());
                    var content = $("#txtField").contents().find("body").html();


                    $.ajax({
                        type: "POST",
                        url: "tester.php",
                        dataType: "json",
                        data: {text:content},
                        success : function(data){
                            if (data.code == "200"){
                                alert("Success: " +data.msg);
                            } else {
                                $(".display-error").html("<ul>"+data.msg+"</ul>");
                                $(".display-error").css("display","block");
                            }
                        }
                    });


                });
            });

         /*   function login() {
        // Form fields, see IDs above
        const params = {
            email: document.querySelector('#loginEmail').value,
            password: document.querySelector('#loginPassword').value
        }

        const http = new XMLHttpRequest()
        http.open('POST', '/login')
        http.setRequestHeader('Content-type', 'application/json')
        http.send(JSON.stringify(params)) // Make sure to stringify
        http.onload = function() {
            // Do whatever with response
            alert(http.responseText)
        }
    } */
        </script>
        <script>
            var showingSourceCode = false;
            var isInEditMode = true;

            function enableEditMode(){
                richTextField.document.designMode = "On";
            }
            function execCmd (command){
                richTextField.document.execCommand(command, false, null);
            }
            function execCommandWithArg(command, arg){
                richTextField.document.execCommand(command, false, arg);
            }
            function toggleSource(){
                if(showingSourceCode){
                    richTextField.document.getElementsByTagName("body")[0].innerHtml = richTextField.document.getElementsByTagName("body")[0].textContent;
                    showingSourceCode = false;
                } else {
                    richTextField.document.getElementsByTagName("body")[0].textContent = richTextField.document.getElementsByTagName("body")[0].innerHtml;
                    showingSourceCode = true;
                }
                function toggleEdit(){
                    if(isInEditMode){
                        richTextField.document.designMode = "Off";
                        isInEditMode = false;
                    } else {
                        richTextField.document.designMode = "On";
                        isInEditMode = true;
                    }
                }
            }

        </script>
    </body>
</html>