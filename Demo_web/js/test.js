let total = 0;
function calculate(){
    
 for(let i=0;i<=1000;i++){
    console.log(i);
    total +=i;
}
aftetcalculate();
}
//  thong tin
function aftetcalculate(total){
}
calculate();

function saveCandidate(candidate){
    console.log("saveCandidate:1. candidate: ", candidate);
    if(candidate.FullName){
     console.log("saveCandidate:1.1. FullName: ", candidate.FullName);   
    }
    else{
        console.log("saveCandidate:1.2 ", candidate);
    }
}

saveCandidate({});