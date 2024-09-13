let calculation = localStorage.getItem('calculation') ||''


displayCalculation()
function updateCalculation(value){
  calculation += value;

  displayCalculation()

  localStorage.setItem('calculation', calculation)
}

function displayCalculation(){
  document.querySelector('.js-calculation').innerHTML= calculation
}

function qaziMohamad(){

  showTexts()

const qazi = document.querySelector('.qazi')

qazi.classList.add('qaziShow')



let audio = new Audio('qazi-voice.MP3');
audio.play();



  const remove = document.querySelector('.remove')

    remove.classList.add('removed');
 

  
  

  console.log(calculation)

  function removeTemporarily() {
    const header = document.getElementById('header');
    
    header.classList.add('hidden');

    setTimeout(() => {
      const parent = header.parentNode; 
      parent.removeChild(header);

      setTimeout(() => {
        parent.appendChild(header);

        setTimeout(() => {
          header.classList.remove('hidden');
        }, 50); 
      }, 90000); 
    }, 1000); 

    
    
      
   
    
    
  }
  removeTemporarily()
 


  setTimeout(function() {
    location.reload();
  }, 93000);
  
}

window.onload = function() {
  calculation = localStorage.getItem('calculation') || '';
  displayCalculation();
  
};






function showText(text, delay, duration, callback) {
  const tempText = document.createElement('div');
  tempText.classList.add('temp-text');
  tempText.innerText = text;
  const container = document.getElementById('temp-container');
  container.appendChild(tempText);


  setTimeout(() => {
    tempText.classList.add('visible');

    setTimeout(() => {
      tempText.classList.add('hidden');
    }, duration); 

    setTimeout(() => {
      container.removeChild(tempText);
      if (callback) {
        callback();
      }
    }, duration + 1000); 
  }, delay);
}

function showTexts() {
  const texts = [
    'وەبیرمە لە مەکتەبا دەیان پرسی دوو دانە دوو دەکاتە چەن',//1
    'هەموو تێکرا دەیان نووسی دەکاتە چوار',//2
    'کەچی ئەمن لە حسابا نمرەی کەمم دەهێناو دەهاتمە خوار',//3
    'ئەویش تەنیا لەبەر ئەوەی لای من وابوو دوو دانە دوو دەبێ بە یەک نابێ بە چوار',//4
    'لای من وابوو، لای من وابوو ددان و دوو لێو و زبان نابن بە چوار دەبن بەزار بە تێک ڕایی دەکەن هاوار',//5
    'لای من وابوو دوو دەست و دوو لاقی مرۆڤ نابن بە چوار لە لەشێکا وا دێنە کار',//6
    'لای من وابوو گەڕەک خانوو کۆلان شەقام نابن بە چوار دەبن بە شار تێیدا دەژین دەوڵەمەند و خەڵکی هەژار',//7
    'لای من وابوو کۆلکە و ڕیشە لق و گەڵا نابن بە چوار دەبن بە دار هێندێ کورت و هێندێ درێژ وەکوو چنار',//8
    'لای من وابوو ئەوین و دڵ، جوانی و پاکی نابن بە چوار دەبن بە یار لە لای دڵدار',//9
    'ئەو هەمووەی وا دوو بە دوو دەبن بە یەک نابن بە چوار یەکجار زۆرن، بەڵام لە کوێ دێنە ژمار',//10
    'تەنیا ئەوەندەی دەزانم ئەگەر لەشم سەد پارچەکەن بمدەنە ژێر گوولە و ڕەگبار بچمە سەردار، قسەی دڵم دێتە سەرزار',//11
    '.کوردستانم هەر ووڵاتێکەو نابێت بە چوار'//12

  ];

  const delays = [
    2050,  //1 Delay before showing the first text
  200,  //2 Delay before showing the second text
    200,//3
      200,//4
      300,//5
      100,//6
      600,//7
      100,//8
      2400,//9
      100,//10
      100,//11
      50,//12
      ];

  const durations = [
    3500,  //1 Duration for the first text
    2600,  //2 Duration for the second text
    4200 ,//3
    6000  ,//4
    8700,//5
    5000,//6
    7700,//7
    6500,//8
    6700,//9
    6400,//10
    8700,//11
    4600,//12
  ];

  let index = 0;

  function next() {
    if (index < texts.length) {
      showText(texts[index], delays[index], durations[index], next);
      index++;
    }
  }

  next();
  
}


