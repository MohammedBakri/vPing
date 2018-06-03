require("./style.less");
$(document).ready(function () {
    $(".btn-pref .btn").click(function () {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        // $(".tab").addClass("active"); // instead of this do the below 
        $(this).removeClass("btn-default").addClass("btn-primary");
    });
});

// loading Spinner
window.hideLoading = function(){
    return $('body').addClass('loaded');
};

window.showLoading = function(){
    return $('body').removeClass('loaded');
};

window.getSignals = function(){
    window.showLoading();
    $.ajax({
        type: 'POST',
        data: '',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        url: window.location.origin+"/api/getSignals",
        success: function (data) {
            console.log(data);
            DisplayDataInGrid(data); 
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function DisplayDataInGrid(data){
    var dataObject = {
        allowFilters: true,
        searchSourceName: "Signals",
        rows: data,
        columns: [{
            alias: 'Customer Name',
            key: 'customerName',
            allowFiltering: true,
            allowCellAction: false
        },{
            alias: 'Vehicle Id',
            key: 'vehicleId',
            allowFiltering: true,
            allowCellAction: false
        },{
            alias: 'Status',
            key: 'status',
            allowFiltering: true,
            allowCellAction: false
        },{
            alias: 'Status Date/Time',
            key: 'StatusDateTime',
            allowFiltering: true,
            allowCellAction: false
        }]
    }
     // init data browser
    require('./components/data-browser/data-browser.jsx').renderComponent("databrowser-placeHolder", [dataObject]);
    window.hideLoading();
}


// startup
window.getSignals();
