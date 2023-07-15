const dropZone=document.querySelector('.drop-zone');
const fileInput=document.querySelector('#fileInput');
const browseBtn=document.querySelector('.browseBtn');
const host="https://file-sharing.vivekjha7777.repl.co/";
const uploadURL= `${host}api/files`;

const emailURL=`${host}api/files/send`;

const progressContainer=document.querySelector('.progress-container')
const bgProgress=document.querySelector('.bg-progress');
const progressBar=document.querySelector('.progress-bar')
const percentDiv=document.querySelector('#percent');
const copyBtn=document.querySelector('#copyBtn');

const emailForm=document.querySelector('#emailForm');

const toast=document.querySelector('.toast')

const sharingContainer=document.querySelector('.sharing-container');
const fileURLInput=document.querySelector('#fileURL');

const maxAllowedSize= 100*1024*1024  //1mb

dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault()  //by default downloading
    if(!dropZone.classList.contains('dragged')){
    dropZone.classList.add('dragged');
    }
});

dropZone.addEventListener('dragleave',()=>{
    dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop',(e)=>{
    e.preventDefault();
    dropZone.classList.remove('dragged');
   //just check ones  console.log(e);
   //console.log(e.dataTransfer.files);
   const files=e.dataTransfer.files;
   console.log(files);
   if(files.length){
    fileInput.files=files;
    uploadFile();
   }
   
});

fileInput.addEventListener("change",()=>{
    uploadFile();
})

browseBtn.addEventListener('click',()=>{
    fileInput.click();
})

copyBtn.addEventListener('click',()=>{
    fileURLInput.select();
    navigator.clipboard.writeText(fileURLInput.value);
    showToast('Link copied');
})

const uploadFile=()=>{
    if(fileInput.files.length>1){
        resetFileInput();
        showToast("Only upload 1 file!");
        return;
    }
    const file=fileInput.files[0];
    if(file.size>maxAllowedSize){
     showToast("Can't upload more than 100MB");
     resetFileInput();
     return;
    }
    progressContainer.style.display="block";

    const formData=new FormData();
    formData.append("myfile",file);

    const xhr=new XMLHttpRequest()
    //change here
    xhr.onreadystatechange = () => {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.response);
        onUploadSuccess(response);
      } catch (error) {
        resetFileInput();
        showToast('Error in upload: Invalid response');
      }
    } else {
      resetFileInput();
      showToast(`Error in upload: ${xhr.statusText}`);
    }
  }
};

    //upload progress
    xhr.upload.onprogress=updateProgress;

    xhr.upload.onerror=()=>{
        resetFileInput();
        showToast(`Error in upload: ${xhr.statusText}`);
    }
    xhr.open('POST',uploadURL);
    xhr.send(formData);
}

const updateProgress=(e)=>{
    const percent=Math.round((e.loaded/e.total)*100);
    console.log(percent);
   console.log(e);
   bgProgress.style.width=`${percent}%`;
   percentDiv.innerHTML=percent;
   progressBar.style.transform=`scaleX(${percent/100}%)`
}

const onUploadSuccess=({file:url})=>{
    console.log(url)
    resetFileInput();
    emailForm[2].removeAttribute('disabled');
    progressContainer.style.display="none";
    sharingContainer.style.display="block";
    fileURLInput.value=url;
}

const resetFileInput=()=>{
   fileInput.value="";
}

emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = fileURLInput.value;
    const formData = {
        uuid: url.split('/').splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements['from-email'].value,
    };
    emailForm[2].setAttribute('disabled',"true");
    console.table(formData);

    fetch(emailURL,{
        method:"POST",
        headers:{
            "content-type": "application/json"
        },
        body:JSON.stringify(formData),
    })
    .then(res=>res.json())
    .then(({success})=>{
      if(success){
        sharingContainer.style.display="none";
        showToast('Email Sent');
      }
    })
});

let toastTimer;
const showToast=(msg)=>{
    toast.innerHTML=msg;
    toast.style.transform='translate(-50%,0)';
     clearTimeout(toastTimer);  
    toastTimer=setTimeout(()=>{
      toast.style.transform='translate(-50%,60px)';
    },2000)
}

