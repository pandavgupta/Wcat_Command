#!/usr/bin/env node

const fs= require('fs')
const path = require('path/posix')

let argumentsList= process.argv.slice(2)
let fileList=[];
let optionList=[];
// separate arguments and options
for(let i=0; i<argumentsList.length; i++){
 if(argumentsList[i][0]=='-'){
  optionList.push(argumentsList[i])
 }
 else 
  fileList.push(argumentsList[i]);
}

// finding value of option
let isNpresent = optionList.includes('-n');
let isSpresent = optionList.includes('-s');
let isBpresent = optionList.includes('-b');
let isHpresent = optionList.includes('-h') || optionList.includes('--help');

//help option
if(isHpresent){
    help();
    return;
}
//edge case
if(isNpresent && isBpresent){
 console.log("!! Error -b and -n both are not compatible at same time")
 return;
}
// running for every file
for(let i=0; i<fileList.length; i++){
    dislay_content(fileList[i],isNpresent,isSpresent,isBpresent)
}

//display function
function dislay_content(filepath,show_number,remove_extra_line,num_non_empty_line){
    if(filepath==undefined){
       console.log('!! enter correct file path');
       help()
        return ;
    }
    else{
        if(fs.existsSync(filepath) && fs.lstatSync(filepath).isFile()){
            display_helper(filepath,show_number,remove_extra_line,num_non_empty_line)
        }
        else{
            let filename=path.basename(filepath)
            let newfilepath= path.join(__dirname,filename)
            if(fs.existsSync(newfilepath) && fs.lstatSync(filepath).isFile()){
                display_helper(newfilepath,show_number,remove_extra_line,num_non_empty_line)
               }
            else
            console.log("!! file doesn't exists..")
            help()
            return;
        }

    }

}

function display_helper(filepath,show_number,remove_extra_line,num_non_empty_line){


    let buffer= fs.readFileSync(filepath);
    let content=""+buffer;
    let contentArr= content.split("\r\n")
    let i=1;
    let flag=1;
    let show=1;
    for(let j=0; j<contentArr.length; j++){
           
                if(remove_extra_line ){
                    if(contentArr[j]==="" ){
                        if(!flag)
                        show=0;
                        flag=0;
                        
                    }
                    else{
                        flag=1;
                        show=1;
                    }
                       
                }
                if(show_number){
                    contentArr[j]=i+" "+contentArr[j];
                    i++;
                }
                if(num_non_empty_line){
                    if(!(contentArr[j]==="")){
                        contentArr[j]=i+" "+contentArr[j];
                    i++;
                    }
                }
               if(show)
                    console.log(contentArr[j])
                

    }

}
 
// help function
function help(){
    console.log(`
# Wcat 
It is used to display or make a copy of content for one or more files in the terminal

## Commands:
*  wcat filepath => displays content of the file in the terminal 
*  wcat filepath1 filepath2 filepath3  => displays content of all files in the
     terminal(contactinated form) in the given order. 
*  wcat -s filepath => convert big line breaks into a singular line break 
*  wcat -n filepath => give numbering to all the lines
*  wcat -b filepath => give numbering to non-empty lines
    `)
}


