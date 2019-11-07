//data controller module
var dataControl = (function(){
    var usersLocalStorage = {
        setUserCollection: function(newCollection){
            localStorage.setItem('usersCollection', JSON.stringify(newCollection));
        },
        getUserCollection: function(){
            return JSON.parse(localStorage.getItem('usersCollection'));
        },
        removeUserCollection: function(){
            localStorage.removeItem('usersCollection');
        }
    };
    if(!usersLocalStorage.getUserCollection()){
        usersLocalStorage.setUserCollection([]);
    }

    //user function constructor
    function User(user){
        this.name = user.name,
        this.height = user.height,
        this.age = user.age,
        this.mass = user.mass,
        this.gender = user.gender
    };
    return {
        usersDb: usersLocalStorage,
        addUser: function(user){
            var newUser = new User(user);
            var userInCol = usersLocalStorage.getUserCollection();
            userInCol.push(newUser);
            usersLocalStorage.setUserCollection(userInCol);
        },
        getTime: function(){
            var t = new Date(),
            minutes = t.getMinutes().toString().length == 1 ? '0'+t.getMinutes() : t.getMinutes(),
            hours = t.getHours().toString().length == 1 ? '0'+t.getHours() : t.getHours(),
            ampm = t.getHours() >= 12 ? 'pm' : 'am',
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            return days[t.getDay()]+' '+months[t.getMonth()]+' '+t.getDate()+' '+t.getFullYear()+' '+hours+':'+minutes+ampm;
        }
    }
})();


//user interface controller
var uiControl = (function(){
    var domElem = {
        date: document.querySelectorAll('.date-now'),
        addUser: document.querySelector('.add-user'),
        userList: document.querySelector('.users-list'),
        userStatsDiv: document.querySelector('.stats'),
        graphType: document.querySelector('.graph-type'),
        pieChart: document.getElementById('chart'),
        barGraph: document.getElementById('graph')
    };

    //modals
    var openMod = {
        addUserModal: function(){
            if(document.querySelector('.popup-modal'))return;
            var aUm = document.createElement('div');
            aUm.setAttribute('class', 'popup-modal bg-info text-light shadow');
            aUm.setAttribute("tabindex", 1);

            var header = document.createElement('h4');
            header.setAttribute('class', 'color-wheat');
            header.textContent = 'Add User';
            aUm.appendChild(header);

            //firstname lastname div
            var inputRow = document.createElement('div');
            inputRow.setAttribute('class', 'row mt-4');
            
            //first name input element
            var fnameCol = document.createElement('div');
            fnameCol.setAttribute('class', 'col');
            
            var Fname = document.createElement('input');
            Fname.setAttribute('type', 'text');
            Fname.setAttribute('class', 'form-control');
            Fname.setAttribute('id', 'firstname');
            Fname.setAttribute('placeholder', 'First Name');
            fnameCol.appendChild(Fname);
            inputRow.appendChild(fnameCol);

            //last name input element
            var lnameCol = document.createElement('div');
            lnameCol.setAttribute('class', 'col');
            
            var Lname = document.createElement('input');
            Lname.setAttribute('type', 'text');
            Lname.setAttribute('class', 'form-control');
            Lname.setAttribute('id', 'lastname');
            Lname.setAttribute('placeholder', 'Last Name');
            lnameCol.appendChild(Lname);
            inputRow.appendChild(lnameCol);
            aUm.appendChild(inputRow);

            //height and mass input element
            var hinputRow = document.createElement('div');
            hinputRow.setAttribute('class', 'row mt-2');

            //first name input element
            var heightCol = document.createElement('div');
            heightCol.setAttribute('class', 'col');
            
            var heightInp = document.createElement('input');
            heightInp.setAttribute('type', 'text');
            heightInp.setAttribute('class', 'form-control');
            heightInp.setAttribute('placeholder', 'Height in cm');
            heightInp.setAttribute('id', 'height');
            heightCol.appendChild(heightInp);
            hinputRow.appendChild(heightCol);

            //last name input element
            var massCol = document.createElement('div');
            massCol.setAttribute('class', 'col');
            
            var mass = document.createElement('input');
            mass.setAttribute('type', 'text');
            mass.setAttribute('class', 'form-control');
            mass.setAttribute('placeholder', 'Body Mass in Kg');
            mass.setAttribute('id', 'mass');
            massCol.appendChild(mass);
            hinputRow.appendChild(massCol);
            aUm.appendChild(hinputRow);

            //age and mass input element
            var ainputRow = document.createElement('div');
            ainputRow.setAttribute('class', 'row mt-2');

            //age input element
            var ageCol = document.createElement('div');
            ageCol.setAttribute('class', 'col');
            
            var ageInp = document.createElement('input');
            ageInp.setAttribute('type', 'text');
            ageInp.setAttribute('class', 'form-control');
            ageInp.setAttribute('placeholder', 'Age in Year');
            ageInp.setAttribute('id', 'age');
            ageCol.appendChild(ageInp);
            ainputRow.appendChild(ageCol);

            //gender select element
            var genderCol = document.createElement('div');
            genderCol.setAttribute('class', 'col');
            
            var gender = document.createElement('select');
            gender.setAttribute('class', 'custom-select');
            gender.setAttribute('id', 'gender');
            
            var genderOpt = document.createElement('option');
            genderOpt.setAttribute('value', '');
            genderOpt.textContent = '-- Select Gender --';

            var male = document.createElement('option');
            male.setAttribute('value', 'male');
            male.textContent = 'Male';

            var female = document.createElement('option');
            female.setAttribute('value', 'female');
            female.textContent = 'Female';

            gender.appendChild(genderOpt);
            gender.appendChild(male);
            gender.appendChild(female);
            genderCol.appendChild(gender);
            ainputRow.appendChild(genderCol);
            aUm.appendChild(ainputRow);

            //cancel and save button element
            var btnDiv = document.createElement('div');
            btnDiv.setAttribute('class', 'row justify-content-center mt-3');
            
            var cancelBtn = document.createElement('button');
            cancelBtn.setAttribute('class', 'btn btn-danger close-modal mx-2');
            cancelBtn.textContent = 'Cancel';
            btnDiv.appendChild(cancelBtn);
            
            var saveBtn = document.createElement('button');
            saveBtn.setAttribute('class', 'save-modal btn btn-success mx-2');
            saveBtn.textContent = 'Save';
            btnDiv.appendChild(saveBtn);
            aUm.appendChild(btnDiv);

            return aUm;
        },
        getModalData: function(e, cb){
            if(!e.target.parentNode.parentNode.classList.contains('popup-modal')) return cb({});
            try {
                var name = document.getElementById('firstname').value !== '' && document.getElementById('lastname').value !== '' ? encodeURIComponent(document.getElementById('firstname').value)+' '+encodeURIComponent(document.getElementById('lastname').value) : null;
                var height = document.getElementById('height').value !== '' ? encodeURIComponent(document.getElementById('height').value) : null;
                var age = document.getElementById('age').value !== '' ? encodeURIComponent(document.getElementById('age').value) : null;
                var mass = document.getElementById('mass').value !== '' ? encodeURIComponent(document.getElementById('mass').value) : null;
                var gender = document.getElementById('gender').value ? encodeURIComponent(document.getElementById('gender').value) : null;
            } catch (err) {
                console.log(err);
                return cb(null);
            }
            
            return cb({
                name,
                height,
                age,
                mass,
                gender
            })
        },
        close: function(){
            return document.querySelector('.popup-modal').remove();
        } 
    };

    //show users in html
    function showUsers(u){
        var uElem = document.createElement('p');
        uElem.setAttribute('class', 'user-para my-2');
        uElem.textContent = u.name;
        return domElem.userList.appendChild(uElem);
    };

    //add user button
    function addUserBtn(){
        var uElem = document.createElement('button');
        uElem.setAttribute('class', 'btn-add-user');
        uElem.textContent = 'Add Users';
        return domElem.userList.appendChild(uElem);
    }
    //show stats
    function showStats(s){
        var uElem = document.createElement('p');
        uElem.setAttribute('class', 'user-stats');
        uElem.textContent = s;

        return domElem.userStatsDiv.appendChild(uElem);
    }

    //calculate user stats
    var userStats = {
        getBmi: function(u){
            return (parseInt(u.mass, 10)/(parseInt(u.height, 10)/100*parseInt(u.height, 10)/100)).toFixed(1);
        },
        getBmr: function(u){
            if(u.gender === 'male'){
                return (88.362+(13.397*parseInt(u.mass, 10))+(4.799*parseInt(u.height, 10))-(5.677*parseInt(u.age, 10))).toFixed(1);
            }else{
                return (447.593 + (9.247*parseInt(u.mass, 10)) + (3.098*parseInt(u.height, 10)) - (4.330*parseInt(u.age, 10))).toFixed(1);
            }
        },
        getBodyFat: function(u,b){
            if(parseInt(u.age, 10)<18){
                if(u.gender === 'male'){
                    return ((((1.51*b)-(0.70*parseInt(u.age, 10))-(3.6*1)+1.4)/100)*parseInt(u.mass, 10)).toFixed(1);
                }else{
                    ((((1.51*b)-(0.70*parseInt(u.age, 10))-(3.6*0)+1.4)/100)*parseInt(u.mass, 10)).toFixed(1);
                };
            }else{
                if(u.gender === 'male'){
                    return ((((1.20*b)+(0.23*parseInt(u.age, 10))-(10.8*1)-5.4)/100)*parseInt(u.mass, 10)).toFixed(1);
                }else{
                    return ((((1.20*b)+(0.23*parseInt(u.age, 10))-(10.8*0)-5.4)/100)*parseInt(u.mass, 10)).toFixed(1);
                };
            }
        }
    }    

    return {
        domItem: domElem,
        modal: openMod,
        showDate: function(t){
            domElem.date.forEach(function(el){
                el.innerHTML = '';
                el.innerHTML = t;
                return;
            });
        },
        displayUsers: function(users){
            domElem.userList.innerHTML = '';
            var uDb = users.getUserCollection();
            if(uDb.length<=0){
                return addUserBtn();
            }
            for(var i=0; i<uDb.length; i++){
                showUsers(uDb[i]);
            };
            return;
        },
        loadStats: function(usrStat){
            domElem.userStatsDiv.innerHTML = '';
            var bmr = userStats.getBmr(usrStat);
            var bmi = userStats.getBmi(usrStat);
            var bodyFat = userStats.getBodyFat(usrStat, bmi);
            var muscleMass = parseInt(usrStat.mass)-bodyFat;
            showStats('BMR: '+bmr);
            showStats('BMI: '+bmi);
            showStats('Body Fat: '+bodyFat+'Kg');
            showStats('Muscle Mass: '+muscleMass+'Kg');
        }
    }
})();


window.onload = function(){
    //display available users in localstorage
    this.uiControl.displayUsers(dataControl.usersDb);
    // Search for elements by class and display date picker
    var allElements = document.getElementsByTagName("*");
    for (var i=0; i<allElements.length; i++) {
        var className = allElements[i].className;
        if (className=='datepicker' || className.indexOf('datepicker ') != -1 || className.indexOf(' datepicker') != -1) {
        // Found one! Now lets add a datepicker next to it  
        var a = document.createElement('a');
        a.href='#';
        a.setAttribute('class', "datepickershow");
        a.setAttribute('onclick','return showDatePicker("' + allElements[i].id + '")');
        var img = document.createElement('img');
        img.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABGdBTUEAAK/INwWK6QAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAAdtJREFUOE+Vj+9PUnEUxvPvar3xja96Q1hGEKG0ubZqbfHCNqIVA4eYLAwFp0LYD4iIJEdeRGGZwDAEcUOn9oNIvPcGgjBQfHE69/YFihe1zs59du7d83nOuR0AcOq/CgEqWbaHDqaD+clF1rLAmija6MsZ5vb0s9nB1xm168s9x67y6Y7q2TaXjo8tVKjUTv7Zt61pAkwt/UA3zFwFuxysV2BKAuYeMAnBcBaGukDdCaozaLg5sUGAiQDLA3IIDIBfAfO34N118PaDRwYvRfBcCMrTaLg2liTAOEW3NjzpBZsMpqUwKQaLCMYvwGMhjArQIDfGCTDqy3EAX47lfVTnCo3qCnOzJ8IpW6pJR2IEGHn7/bBaR5MLO8y8CtPuKO2J0nMfGdKr+5uZ4kVdhAD6N99K1bo7ynB5vHpj3AZ0NxWBbs0KAbTur8VKfTbGeFcbkc1sfnBHuA1CzTIB7js/H5SPffFW3q9sau2PDdLhxkl3X+wiQCVYf4Jt3h1Itmb8iBvEusZJd2a2CuXjxXUWU5dSnAZ5/b0QkOobgMKWzh8eMcXaXr6aYSqfcuXtbAkdbS3RfSD/MGDfvGFO9ZuSfY/ilx/GLumi57Vhgfp9W597ECJA2/a/v/4ENLpYKsDo3kgAAAAASUVORK5CYII=';
        img.title='Show calendar';
        a.appendChild(img);
        insertAfter(a, allElements[i]);
        }
    }
    //get current date and display
    function display(){
        uiControl.showDate(dataControl.getTime());
    }
    setInterval(display, 1000);

    //add user function
    uiControl.domItem.addUser.addEventListener('click', function(e){
        e.preventDefault();
        if(e.target.innerText === 'Add User'){
            document.body.appendChild(uiControl.modal.addUserModal());
        }
    });
    document.addEventListener('click', function(e){
        e.preventDefault();
        //add user 
        if(e.target.classList.contains('btn-add-user')){
            document.body.appendChild(uiControl.modal.addUserModal());
        }
        //close modal
        if(e.target.classList.contains('close-modal')){
            uiControl.modal.close();
            return;
        };

        //save modal input
        if(e.target.classList.contains('save-modal')){
            uiControl.modal.getModalData(e, function(userData){
                if(!userData.name && !userData.age && !userData.height && !userData.mass)return;
                dataControl.addUser(userData);
                uiControl.displayUsers(dataControl.usersDb);
                uiControl.modal.close();
                return;
            });
        };

        //manipulate user data
        if(e.target.classList.contains('user-para')){
            var uList = Array.from(e.target.parentNode.children);
            uList.forEach(function(list){
                list.classList.remove('user-para-active');
            });
            e.target.classList.add('user-para-active');
            var users = dataControl.usersDb.getUserCollection();
            users.forEach(function(user){
                if(user.name === e.target.innerText){
                    uiControl.loadStats(user);
                }
            });
        };

        //graph chart switch
        if(e.target.classList.contains('slider')){
            if(e.target.firstElementChild.classList.contains('slider-on')){
                e.target.firstElementChild.classList.remove('slider-on');
                e.target.firstElementChild.classList.add('slider-off');
                uiControl.domItem.graphType.innerText = '';
                uiControl.domItem.graphType.innerText = 'Bar Graph';
                uiControl.domItem.barGraph.style.display = 'block';
                uiControl.domItem.pieChart.style.display = 'none';
                return;
            } else{
                e.target.firstElementChild.classList.add('slider-on');
                e.target.firstElementChild.classList.remove('slider-off');
                uiControl.domItem.graphType.innerText = '';
                uiControl.domItem.graphType.innerText = 'Pie Chart';
                uiControl.domItem.pieChart.style.display = 'block';
                uiControl.domItem.barGraph.style.display = 'none';
                return;
            };
        }
    });
};