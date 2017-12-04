window.addEventListener('load', function() {
/* TABS */
  var tabs = document.querySelectorAll('.tab');
  var overviewSection = document.querySelector('#overview');
  var studentsSection = document.querySelector('#students');
  var teachersSection = document.querySelector('#teachers');

  function showTab(event) {
    var tab = event.target.textContent;
    switch (true) {
    case (tab === 'Overview'):
      overviewSection.classList.remove('display-none');
      studentsSection.classList.add('display-none');
      teachersSection.classList.add('display-none');
      break;
    case (tab === 'Students'):
      overviewSection.classList.add('display-none');
      studentsSection.classList.remove('display-none');
      teachersSection.classList.add('display-none');
      break;
    case (tab === 'Teachers'):
      overviewSection.classList.add('display-none');
      studentsSection.classList.add('display-none');
      teachersSection.classList.remove('display-none');
      break;
    default:
      overviewSection.classList.add('display-none');
      studentsSection.classList.add('display-none');
      teachersSection.classList.add('display-none');
      break;
    }
  }

  for (var i = 0;i < tabs.length;i++) {
    tabs[i].addEventListener('click', showTab);
  }

  /* Sedes y Generación */
  // Arequipa
  var dataA2017I = document.getElementById('dataA_2017I');
  var dataA2016II = document.getElementById('dataA_2016II');
  // México
  var dataM2017I = document.getElementById('dataM_2017I');
  var dataM2017II = document.getElementById('dataM_2017II');
  // Lima
  var dataL2017I = document.getElementById('dataL_2017I');
  var dataL2017II = document.getElementById('dataL_2017II');
  var dataL2016II = document.getElementById('dataL_2016II');
  // Chile
  var dataC2017I = document.getElementById('dataC_2017I');
  var dataC2017II = document.getElementById('dataC_2017II');
  var dataC2016II = document.getElementById('dataC_2016II');

  dataA2017I.addEventListener('click', function() {
    resultSede('AQP', '2017-1');
  });
  dataA2016II.addEventListener('click', function() {
    resultSede('AQP', '2016-2');
  });
  dataM2017I.addEventListener('click', function() {
    resultSede('CDMX', '2017-1');
  });
  dataM2017II.addEventListener('click', function() {
    resultSede('CDMX', '2017-2');
  });
  dataL2017I.addEventListener('click', function() {
    resultSede('LIM', '2017-1');
  });
  dataL2017II.addEventListener('click', function() {
    resultSede('LIM', '2017-2');
  });
  dataL2016II.addEventListener('click', function() {
    resultSede('LIM', '2016-2');
  });
  dataC2017I.addEventListener('click', function() {
    resultSede('SCL', '2017-1');
  });
  dataC2017II.addEventListener('click', function() {
    resultSede('SCL', '2017-2');
  });
  dataC2016II.addEventListener('click', function() {
    resultSede('SCL', '2016-2');
  });


  /* Funciones que obtienen información */
  function resultSede(branch, generation) {
    enrollment(branch, generation);
    achievement(branch, generation);
    nps(branch, generation);
    studentFilter(branch, generation);
  };
  /* funciones*/

  function enrollment(branch, generation) {
    var boxStudentsActive = document.querySelector('.students-active');
    var percentageDropout = document.querySelector('.percentage-dropout'); 
    
    
    var totalStudents = data[branch][generation]['students'].length; // 15
    
    var percentageActive = ((active(branch, generation)) * (100 / (totalStudents))).toFixed(1);
    var percentageInactive = ((inactive(branch, generation)) * (100 / (totalStudents))).toFixed(1);
    
    boxStudentsActive.textContent = active(branch, generation);
    percentageDropout.textContent = percentageInactive;
  }
  
  function active(branch, generation) {
    var students = data[branch][generation]['students'];
    var active = 0;
    for (var i = 0; i < students.length; i++) {
      // true o false
      if (students[i]['active'] == true) {
        active++;
      }
    }
    return active;
  };

  function inactive(branch, generation) {
    var students = data[branch][generation]['students'];
    var inactive = 0;
    for (var i = 0; i < students.length; i++) {
      // true o false
      if (students[i]['active'] == false) {
        inactive++;
      }
    }
    return inactive;
  };

  
  function achievement(branch, generation) {    
    var goldenStudentsParagraph = document.querySelector('.golden-students');
    goldenStudentsParagraph.textContent = goldenStudents(branch, generation);
    var percentageGoldenStudentsParagraph = document.querySelector('.percentage-golden');
    percentageGoldenStudentsParagraph.textContent = percentageGoldenStudents(branch, generation) ;
  };
 
  function goldenStudents(branch, generation) {
    var students = data[branch][generation]['students'];
    var quantitySprints = data[branch][generation]['students'][0]['sprints'].length;
    var arrHse = [];
    var arrTech = [];
    var acumHse = 0;
    var acumTech = 0;
    var golden = 0;


    for (var i = 0; i < students.length; i++) {
      for (var j = 0; j < quantitySprints; j++) { 
        var pointsHse = students[i]['sprints'][j]['score']['hse'];
        var pointsTech = students[i]['sprints'][j]['score']['tech'];
        acumHse += pointsHse;
        acumTech += pointsTech;      
      }
      arrHse.push(acumHse / quantitySprints);
      arrTech.push(acumTech / quantitySprints);
      for (k = 0; k < arrHse.length; k++) {
        if (arrHse[k] >= 840 && arrTech[k] >= 1260) {
          golden++;
        }  
      }
      return golden;
    }
  };
  function percentageGoldenStudents(branch, generation) {
    var students = data[branch][generation]['students'].length;
    var percentageGoldenStudent = (((goldenStudents(branch, generation)) * 100) / students).toFixed(1);
    return percentageGoldenStudent;
  }

  function nps(branch, generation) {
    var netPromoter = document.querySelector('.net-promoter-score');
    netPromoter.textContent = (averageNet(branch, generation)).toFixed(1);
  }

  function averageNet(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var sumSprints = 0;

    for (var i = 0; i < ratings.length; i++) {
      var sprintPromoters = ratings[i]['nps']['promoters'];
      var sprintDetractors = ratings[i]['nps']['detractors'];
      var sprintPassive = ratings[i]['nps']['passive'];
      var netps = sprintPromoters - sprintDetractors;
      sumSprints += netps;
      var averageNps = sumSprints / ratings.length;
    }
    return averageNps;
  }

  function studentFilter(branch, generation) {
    // Obtener la referencia del html
    var containerStudents = document.getElementById('container-students');
    // limpiar datos cargados
    containerStudents.textContent = '';
    // declarando variables    
    var arrayPhoto = [];
    var arrayName = [];
    var arrayAverageTech = [];
    var arrayAverageHse = [];
    // obteniendo información de la base de datos
    var students = data[branch][generation].students;
    var arrHse = [];
    var arrTech = [];
    for (var i = 0; i < students.length; i++) {
      if (students[i].active == true) {
        var quantitySprints = data[branch][generation]['students'][i]['sprints'].length;
        var acumHse = 0;
        var acumTech = 0;
        for (var j = 0; j < quantitySprints; j++) { 
          var pointsHse = students[i]['sprints'][j]['score']['hse'];
          var pointsTech = students[i]['sprints'][j]['score']['tech'];
          acumHse += pointsHse;
          acumTech += pointsTech;      
        }
        arrHse.push(((((acumHse / quantitySprints) * 100) / 1200)).toFixed(1));
        arrTech.push(((((acumTech / quantitySprints) * 100) / 1800)).toFixed(1));
      }
    }
    
    
    for (i = 0 ; i < students.length;i++) {
      if (students[i].active == true) {
        arrayName.push(students[i].name);
        arrayPhoto.push(students[i].photo);
      }
    } 
 
    // creando contenedores de información de acuerdo a la cantidad de alumnas
    for (var j = 0; j < arrayName.length; j++) {
      var textCell = document.createElement('div');
      var containerName = document.createElement('div');
      var nameStudent = document.createElement('p');
      var specialization = document.createElement('p');
      var boxTech = document.createElement('div');
      var textTech = document.createElement('p');
      var textDescriptionTech = document.createElement('p');
      var boxHse = document.createElement('div');
      var textHse = document.createElement('p');
      var textDescriptionHse = document.createElement('p');
      var english = document.createElement('div');
      var image = document.createElement('img');
      
      textCell.classList.add('container-cell');
      boxTech.classList.add('minibox-style');
      boxHse.classList.add('minibox-style');
      english.classList.add('minibox-style');
      containerName.classList.add('container-name');
      
      image.setAttribute('src', arrayPhoto[j]);
      nameStudent.textContent = arrayName[j];
      specialization.textContent = 'Fronted Developer';
      textTech.textContent = arrTech[j] + '%';
      textDescriptionTech.textContent = 'Tech Skills';
      textHse.textContent = arrHse[j] + '%';
      textDescriptionHse.textContent = 'Life Skills';
      english.innerHTML = '<p>Interm</p><p>English</p>';
      
      
      // insertando info a los contenedores
      boxTech.appendChild(textTech);
      boxTech.appendChild(textDescriptionTech);
      boxHse.appendChild(textHse);
      boxHse.appendChild(textDescriptionHse);
      containerName.appendChild(nameStudent);
      containerName.appendChild(specialization);
      textCell.appendChild(image);
      textCell.appendChild(containerName);
      textCell.appendChild(boxTech);
      textCell.appendChild(boxHse);
      textCell.appendChild(english);
      // insertando al contenedor en html
      containerStudents.appendChild(textCell);
    }
  }
});