var cityId = localStorage.cityId;
cityId = cityId?cityId:'524901';
document.getElementById('cityId').value = cityId;
document.getElementById('save').onclick = function(){
    localStorage.city = document.getElementById('cityId').value;
    alert('保存成功。');
}