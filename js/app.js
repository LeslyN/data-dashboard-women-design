window.addEventListener('load', function() {
  var sedeGeneral;
  var generation;
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
    jediMasterRating(branch, generation); // Lorena
    teacherRating(branch, generation); // Claudia
    satisfaction(branch, generation);
    techSkills(branch, generation); // Eleyne
    
    var select = document.querySelector('.sprint');
    var tech = document.querySelector('.tech');
    select.addEventListener('change', function() {
      var sprint1 = document.querySelector('.sprint-1-t');
      var sprint2 = document.querySelector('.sprint-2-t');
      var sprint3 = document.querySelector('.sprint-3-t');
      if (sprint1.value == 'sprint-1-t') {
        tech.textContent = techSkills(branch, generation)[0];
      }
      if (sprint2.value == 'sprint-2-t') {
        tech.textContent = techSkills(branch, generation)[1];
      }
      if (sprint3.value == 'sprint-3-t') {
        tech.textContent = techSkills(branch, generation)[2];
      }
    });

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

  // LIzbeth
  // Función para crear y añadir el # y % de estudiantes que superan la meta de puntos en promedio de todos los sprints cursado
  function achievement(branch, generation) {
    // Crea y agrega el # de estudiantes que superan la meta en HSE y Tech
    var goldenStudentsParagraph = document.querySelector('.golden-students');
    goldenStudentsParagraph.textContent = studentAchievement(branch, generation);
    // Crea y agrega el % de estudiantes que superan la meta en HSE y Tech
    var percentageGoldenStudentsParagraph = document.querySelector('.percentage-golden');
    percentageGoldenStudentsParagraph.textContent = percentageGoldenStudents(branch, generation) ;
  };

  // Función para calcular el # de estudiantes que superan la meta de 70% de puntos en HSE y Tech
  function studentAchievement(branch, generation) {
    var students = data[branch][generation]['students'];
    var allScoresAverageArr = [];

    for (i = 0; i < students.length; i++) {
      var sumTechScores = 0;
      var sumHseScores = 0;
      if (students[i].active === true) {
        var numSprint = students[i].sprints.length;
        for (j = 0; j < numSprint; j++) {
          var pointsTech = students[i].sprints[j].score.tech;
          var pointsHSE = students[i].sprints[j].score.hse;
          sumTechScores += pointsTech;
          sumHseScores += pointsHSE;
        }
        var averageTech = sumTechScores / numSprint;
        var averageHSE = sumHseScores / numSprint;
        allScoresAverageArr.push([averageTech, averageHSE]);
      }
    }
    var studentsReachingGoal = 0;
    for (k = 0 ; k < allScoresAverageArr.length ;k++) {
      if (allScoresAverageArr[k][0] >= 1260 && allScoresAverageArr[k][1] >= 840) {
        studentsReachingGoal ++;
      }
    }
    return studentsReachingGoal;
  }

  function percentageGoldenStudents(branch, generation) {
    var percentageGoldenStudent = ((studentAchievement(branch, generation) / active(branch, generation)) * 100).toFixed(1);
    return percentageGoldenStudent;
  }
  // FIn Lizbeth

  function nps(branch, generation) {
    var netPromoter = document.querySelector('.net-promoter-score');
    netPromoter.textContent = averageNet(branch, generation);

    var averageSprintPromoters = document.querySelector('.average-promoters');
    averageSprintPromoters.textContent = averagePromoters(branch, generation);
    var averageSprintPassive = document.querySelector('.average-passive');
    averageSprintPassive.textContent = averagePassive(branch, generation);
    var averageSprintDetractors = document.querySelector('.average-detractors');
    averageSprintDetractors.textContent = averageDetractors(branch, generation);
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

  function averagePromoters(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var sumSprintPromoters = 0;
    var sprintPromoters;

    for (var i = 0; i < ratings.length; i++) {
      sprintPromoters = ratings[i]['nps']['promoters'];
      sumSprintPromoters += sprintPromoters;
    }
    var averageSprintPromoters = (sumSprintPromoters / (ratings.length)).toFixed(1);
    return averageSprintPromoters;
  };
  function averagePassive(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var sumSprintPassive = 0;

    var sprintPassive;
    
    for (var i = 0; i < ratings.length; i++) {
      sprintPassive = ratings[i]['nps']['passive'];
      sumSprintPassive += sprintPassive;
    }
    var averageSprintPassive = (sumSprintPassive / (ratings.length)).toFixed(1);
    return averageSprintPassive;
  };
  function averageDetractors(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var sumSprintDetractors = 0;

    var sprintDetractors;
    
    for (var i = 0; i < ratings.length; i++) {
      sprintDetractors = ratings[i]['nps']['detractors'];
      sumSprintDetractors += sprintDetractors;
    }
    var averageSprintDetractors = (sumSprintDetractors / (ratings.length)).toFixed(1);
    return averageSprintDetractors;
  };


  /*  LORE */
  function jediMasterRating(branch, generation) {
    var boxJediRating = document.querySelector('.jedi-master-rating');

    boxJediRating.textContent = jediMasterAverage(branch, generation);
  }

  function jediMasterAverage(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var jediMasterTotalScore = 0;

    for (var i = 0; i < ratings.length; i++) {
      jediMasterTotalScore += ratings[i]['jedi'];
    }
    var average = jediMasterTotalScore / ratings.length;
    return average.toFixed(1);
  }
  /* FIN LORE */

  /** Claudia */
  function teacherRating(branch, generation) {
    var boxTeacherRating = document.querySelector('.teach-rat');
    boxTeacherRating.textContent = teacherAverage(branch, generation);
  }

  function teacherAverage(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var teacherTotalRating = 0;
    for (var i = 0; i < ratings.length; i++) {
      teacherTotalRating += ratings[i]['teacher'];
    }
    var teachAverage = teacherTotalRating / ratings.length;
    return teachAverage.toFixed(1);
  }

  /** FIn claudia */

  /** ELeyne */
  function satisfaction(branch, generation) {
    var boxSatisfaction = document.querySelector('.average');
    boxSatisfaction.textContent = satisfactionStudent(branch, generation);
  };
  function satisfactionStudent(branch, generation) {
    var ratings = data[branch][generation]['ratings'];
    var totalSatisfaction = 0;
    for (var i = 0; i < ratings.length;i++) {
      var sprintLatest = data[branch][generation]['ratings'];
      var meet = ratings[i]['student']['cumple'];
      var beats = ratings[i]['student']['supera'];
      var Satisf = meet + beats;
      totalSatisfaction += Satisf;
      var prom = (totalSatisfaction / (ratings.length)).toFixed(1);
    };
     
    return prom;
  };

  function techSkills(branch, generation) {
    var students = data[branch][generation]['students'];
    var totalTechArray = [];
    var countTechSp1 = 0;
    var countTechSp2 = 0;
    var countTechSp3 = 0;
    var countTechSp4 = 0;

    for (var i = 0; i < students.length; i++) {
      var quantitySprints = students[i].sprints.length;
      if (students[i].active === true) {
        for (var j = 0; j < quantitySprints; j++) {
          if (students[i].sprints[j].number === 1) {
            var techScoreSp1 = students[i].sprints[j].score.tech;
            if (techScoreSp1 >= 1260) {
              countTechSp1++;
            }
          } else if (students[i].sprints[j].number === 2) {
            var techScoreSp2 = students[i].sprints[j].score.tech;
            if (techScoreSp2 >= 1260) {
              countTechSp2++;
            }
          } else if (students[i].sprints[j].number === 3) {
            var techScoreSp3 = students[i].sprints[j].score.tech;
            if (techScoreSp3 >= 1260) {
              countTechSp3++;
            }
          } else if (students[i].sprints[j].number === 4) {
            var techScoreSp4 = students[i].sprints[j].score.tech;
            if (techScoreSp4 >= 1260) {
              countTechSp4++;
            }
          }
        }
      }
    }
    totalTechArray.push(countTechSp1, countTechSp2, countTechSp3, countTechSp4);
    return totalTechArray;
  }

  /* Total de estudiantes superan meta puntos hse - promedio y sprint */
  function hseSkills(branch, generation, sprint) {
    var students = data[branch][generation]['students'];
    var totalStudentsActive = 0;
    var totalStudentSprint = 0;
    for (var i = 0; i < students.length; i++) {
      var quantitySprints = students[i]['sprints'];
      if (students[i].active) {
        for (var j = 0; j < quantitySprints.length; j++) {
          if (quantitySprints[j]['number'] === sprint && quantitySprints[j]['score']['hse'] >= 840) {
            totalStudentSprint++;
          }
        }
      }
    }
    return totalStudentSprint;
  }
  
  function percentageHseSkills(branch, generation, sprint) {
    var totalStudentActive = active(branch, generation);
    var totalHseSprint = hseSkills(branch, generation, sprint);
    var percentage = ((totalHseSprint / totalStudentActive) * 100).toFixed(1);
    return percentage;
  }

  var sprintHseSkills = document.querySelector('.sprint-hse-skills');
  sprintHseSkills.addEventListener('change', showHseSprint);
  

  function showHseSprint(event) {
    var selectSprint = event.target.value;
    switch (true) {
    case selectSprint === '1':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 1);
      percentageHseSkills(sedeGeneral, generation, 1);
      break;
    case selectSprint === '2':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 2);
      percentageHseSkills(sedeGeneral, generation, 2);
      break;
    case selectSprint === '3':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 3);
      percentageHseSkills(sedeGeneral, generation, 3);
      break;
    case selectSprint === '4':
      document.querySelector('#skill-student').textContent = hseSkills(sedeGeneral, generation, 4);
      percentageHseSkills(sedeGeneral, generation, 4);
      break;
    }
    // sedeGeneral = '';
    // generation = '';
    // return selectSprint;
  }


  /** FIn Eleyne */
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