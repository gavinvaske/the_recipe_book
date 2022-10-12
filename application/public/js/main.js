$( document ).ready(function() {
    $('.worlkflow-navigation ul li').on('click', function() {
        const selectedDepartment = $(this).data('department');
        const cssTransitionDelayInMs = 200;

        $('.department-wrapper').hide(cssTransitionDelayInMs);
        
        $(`.department-wrapper*[data-department="${selectedDepartment}"]`).show(cssTransitionDelayInMs);
    });

    function updateTicket(ticketAttributes, ticketId) {
        $.ajax({
            url: `/tickets/update/${ticketId}`,
            type: 'POST',
            data: ticketAttributes,
            success: function(response) {
                if (response.error) {
                    alert(`An error occurred: ${response.error}`);
                }
            },
            error: function(error) {
                console.log(error);
                alert('An error occurred while attempting to update the ticket');
            }
        });
    }

    $('#material-selection').change(function() {
        const selectedMaterialId = $('#material-selection').val();
        const ticketId = $('#department-notes').data('ticket-id');

        const ticketAttributes = {
            primaryMaterial: selectedMaterialId
        };

        updateTicket(ticketAttributes, ticketId);
    });

    $('#department-selection').change(function() {
        const selectedDepartment = $('#department-selection').val();
        const ticketId = $('#department-notes').data('ticket-id');

        if (selectedDepartment !== 'COMPLETED') {
            return;
        }
        
        const ticketAttributes = {
            destination: {
                department: selectedDepartment
            }
        };

        updateTicket(ticketAttributes, ticketId);
    });

    $('#subdepartment-selection').change(function() {
        const selectedDepartment = $('#department-selection').val();
        const selectedSubDepartment = $('#subdepartment-selection').val();
        const ticketId = $('#department-notes').data('ticket-id');

        const ticketAttributes = {
            destination: {
                department: selectedDepartment,
                subDepartment: selectedSubDepartment
            }
        };

        updateTicket(ticketAttributes, ticketId);
    });

    $('.department-alert-notes').on('blur', function() {
        const userInput = this.value;
        const departmentkey = this.id;

        const ticketId = $('#department-notes').data('ticket-id');

        $.ajax({
            url: `/tickets/update/${ticketId}/notes`,
            type: 'POST',
            data: {
                departmentNotes: {
                    [departmentkey]: userInput
                }
            },
            success: function(response) {
                if (response.error) {
                    alert(`An error occurred: ${response.error}`);
                }
            },
            error: function(error) {
                console.log(error);
                alert('An error occurred while attempting to save the notes');
            }
        });
    });

    function populateSubDepartmentsDropdown(departmentName) {
        $.ajax({
            url: '/tickets/find-subdepartments',
            type: 'POST',
            data: {
                departmentName: departmentName
            },
            success: function(response) {
                if (response.error) {
                    alert(`An error occurred: ${response.error}`);
                } else {
                    const subDepartments = response.subDepartments;
                    const subDepartmentDropdown = $('#subdepartment-selection');

                    subDepartmentDropdown.empty();
                    subDepartmentDropdown.append($('<option />').val('').text('-'));

                    subDepartments.forEach((subDepartment) => {
                        subDepartmentDropdown.append($('<option />').val(subDepartment).text(subDepartment));
                    });
                }
            },
            error: function(error) {
                alert('Uh oh, an unknown error occurred, see the console for more details');
                console.log(JSON.stringify(error));
            }
        });
    }

    $('#department-selection').on('change', () => {
        const selectedDepartmentName = $('#department-selection').val();

        if (!selectedDepartmentName) {
            return;
        }
        populateSubDepartmentsDropdown(selectedDepartmentName);
    });

    $('.proof-upload').on('change', function() {
        const productNumber = $(this).attr('id');
        let uploadedFile = this.files[0];
        
        if (!uploadedFile) {
            return;
        }

        let formData = new FormData();
        formData.append('proof', uploadedFile);

        $.ajax({
            url: `/products/${productNumber}/upload-proof`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.error) {
                    alert(`An error occurred: ${response.error}`);
                } else {
                    alert('Upload was successful. TODO: implement a success flash message @Storm');
                }
            },
            error: function(error) {
                alert('Uh oh, an unknown error occurred');
                console.log(JSON.stringify(error));
            }
        });
    });

    const shouldDisplayUserDetails = $('.user-details').length;

    if (shouldDisplayUserDetails) {
        $.ajax({
            url: '/users/logged-in-user-details',
            type: 'GET',
            success: function(userDetails) {
                if (userDetails) {
                    $('.user-name').text(userDetails.fullName ? userDetails.fullName : userDetails.email);
                    $('.job-role').text(userDetails.jobRole ? userDetails.jobRole : 'N/A');
                }
            },
            error: function(error) {
                console.log(error);
                alert('An error occurred while loading user details');
            }
        });
    }

    function buildResultHtmlAccordingToObject(result, endpoint) { // eslint-disable-line complexity
        if (endpoint === '/recipes/query') {
            return `<div> Design Number: ${result.designNumber || 'N/A'}; Die Number: ${result.dieNumber || 'N/A'}; How-to-Video: ${result.howToVideo || 'N/A'}; Notes: ${result.notes || 'N/A'}; Author: ${result.author.email || 'N/A'}; </div>`;
        } else if (endpoint === '/material-orders/query') {
            return `<div> P.O #: ${result.purchaseOrderNumber}; author: ${result.author.email}; ECT... </div>`;
        }
    }

    $('.recipe-search-bar').on('keyup', () => {
        const query = $('.recipe-search-bar').val().trim();
        const pageNumber = 1;
        const resultsPerPage = 15; // TODO STORM: Set this number to be whatever you think is best
        const searchEndpoint = $('.recipe-search-bar').data('search-endpoint');
        console.log(`search endpoint = ${searchEndpoint}`);

        if (!query || !searchEndpoint) {
            $('#search-results').empty();
            return;
        }

        console.log(searchEndpoint);

        $.ajax({
            url: searchEndpoint,
            type: 'POST',
            data: {
                query,
                pageNumber,
                resultsPerPage
            },
            success: function(searchResults) {
                console.log(JSON.stringify(searchResults));
                $('#search-results').empty();
                searchResults.forEach((result) => {
                    const resultAsHtml = buildResultHtmlAccordingToObject(result, searchEndpoint);
                    $('#search-results').append(resultAsHtml);
                });
            },
            error: function() {
                alert('Uh oh, the search feature is currently unavailable');
            }
        });
    });

    const shouldDisplayProfilePicture = $('.profile-picture').length;

    if (shouldDisplayProfilePicture) {
        $.ajax({
            url: '/users/profile-picture',
            type: 'GET',
            success: function(profilePicture) {
                const noProfilePictureExists = !profilePicture || !profilePicture.imageType || !profilePicture.imageData;
                
                if (noProfilePictureExists) {
                    return;
                }

                const contentType = profilePicture.imageType;
                const imageData = profilePicture.imageData;

                $('.profile-picture').css('background', `url('data:image/${contentType};base64,${imageData}') center center no-repeat`);
                $('.profile-picture').css('background-size', 'cover');
            },
            error: function(error) {
                console.log(`An error occurred while fetching your profile picture: ${JSON.stringify(error)}`);
            }
        });
    }

    $('.table th').on('click', function() {
        const columnToSortBy = $(this).attr('id');
        const columnCannotBeSorted = !columnToSortBy;
        const endpoint = $('.table').data('endpoint');

        if (columnCannotBeSorted || !endpoint) {
            return;
        }

        if ($(this).attr('aria-sort') === 'none') {
            $('.table th').attr('aria-sort', 'none');
            $(this).attr('aria-sort', 'ascending');
        } else if ($(this).attr('aria-sort') === 'ascending') {
            $('.table th').attr('aria-sort', 'none');
            $(this).attr('aria-sort', 'descending');
        } else if ($(this).attr('aria-sort') === 'descending') {
            $('.table th').attr('aria-sort', 'none');
            $(this).attr('aria-sort', 'ascending');
        }

        let sortMethod = $(this).attr('aria-sort');

        window.location.href = `${endpoint}?pageNumber=1&sortBy=${columnToSortBy}&sortMethod=${sortMethod}`;
    });

    $('.show-password-1').on('click', function(){
        var passInput=$('#password');
        if (passInput.attr('type')==='password')
        {
            passInput.attr('type','text');
        } else {
            passInput.attr('type','password');
        }
    });

    $('.show-password-1').on('click', function(){
        var passInput=$('#newPassword');
        if (passInput.attr('type')==='password')
        {
            passInput.attr('type','text');
        } else {
            passInput.attr('type','password');
        }
    });


    $('.show-password-2').on('click', function(){
        var passInput=$('#repeatPassword');
        if (passInput.attr('type')==='password')
        {
            passInput.attr('type','text');
        } else {
            passInput.attr('type','password');
        }
    });

    $('#password').on('click', function(){
        $(this).next('.show-password-frame').addClass('active');
    });

    $('#newPassword').on('click', function(){
        $(this).next('.show-password-frame').addClass('active');
    });

    $('#repeatPassword').on('click', function(){
        $(this).next('.show-password-frame').addClass('active');
    });


    $('#email').focusout(function(){
        $('#email').filter(function(){
            var email = $('#email').val();
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if ( !emailReg.test( email ) ) {
                $('.invalid-icon').addClass('active');
                $('#email').addClass('invalid-email');
                $('.text-danger').addClass('active');
            } else {
                $('.invalid-icon').removeClass('active');
                $('#email').removeClass('invalid-email');
                $('.text-danger').removeClass('active');
            }
        });
    });

    $('.user-frame').on('click', function(){
        $('.dropdown-menu.user-options').toggleClass('active');
    });

    $('#recipe-dropdown-trigger').on('click', function(){
        $('.dropdown-menu.recipe-dropdown').toggleClass('active');
        $('#recipe-dropdown-trigger').toggleClass('active');
    });

    $('#material-dropdown-trigger').on('click', function(){
        $('.dropdown-menu.material-dropdown').toggleClass('active');
        $('#material-dropdown-trigger').toggleClass('active');
    });


    $('.options-reveal-box').on('click', function(){
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.options-reveal-box').removeClass('active');
            $(this).addClass('active');
        }
    });

    $('.list-options li').on('click', function(){
        $('.list-options li').removeClass('active');
        $(this).addClass('active');
    });

    $('.list-options li').on('click', function(){
        $(this).each(function(){
            var optionValue = $(this).attr('value');
            if (optionValue){
                $('.content-box').not('.' + optionValue).hide();
                $('.' + optionValue).show();
            } else {
                $('.content-box').hide();
            }
        });
    }).change();



    $(function () {

        $('.quick-filter').click(function() {
            event.stopPropagation();
            $('.person-filter-wrapper .dropdown').removeClass('active');
            $('.person-filter-wrapper .filter').removeClass('active');
            $('.sort-wrapper').removeClass('active');
            $('.sort-dropdown').removeClass('active');
            $('.filter-btn-wrapper').addClass('active');
            if ($('.quick-filter-dropdown').hasClass('active')) {
                $('.filter-btn-wrapper').removeClass('active');
                $('.quick-filter-dropdown').removeClass('active');
            } else if ($('.advanced-filter-dropdown').hasClass('active')){
                $('.quick-filter-dropdown').addClass('active');
                $('.advanced-filter-dropdown').removeClass('active');
            } else {
                $('.quick-filter-dropdown').addClass('active');
            }
        });
    
        $('.btn-advanced-filter').click(function() {
            event.stopPropagation();
            $('.person-filter-wrapper .dropdown').removeClass('active');
            $('.person-filter-wrapper .filter').removeClass('active');
            $('.sort-wrapper').removeClass('active');
            $('.sort-dropdown').removeClass('active');
            $('.filter-btn-wrapper').addClass('active');
            if ($('.advanced-filter-dropdown').hasClass('active')) {
                $('.filter-btn-wrapper').removeClass('active');
                $('.advanced-filter-dropdown').removeClass('active');
            } else if ($('.quick-filter-dropdown').hasClass('active')){
                $('.advanced-filter-dropdown').addClass('active');
                $('.quick-filter-dropdown').removeClass('active');
            } else {
                $('.advanced-filter-dropdown').addClass('active');
            }
        });
    
        $('.btn-person-filter').click(function(){
            event.stopPropagation();
            $('.split-btn-frame.btn-filter .filter-btn-wrapper').removeClass('active');
            $('.split-btn-frame.btn-filter .dropdown').removeClass('active');
            $('.sort-wrapper').removeClass('active');
            $('.sort-dropdown').removeClass('active');
            $(this).toggleClass('active');
            $('.person-filter-dropdown').toggleClass('active');
        });
    
        $('.sort-wrapper').click(function(){
            event.stopPropagation();
            $('.split-btn-frame.btn-filter .filter-btn-wrapper').removeClass('active');
            $('.split-btn-frame.btn-filter .dropdown').removeClass('active');
            $('.person-filter-dropdown').removeClass('active');
            $('.btn-person-filter').removeClass('active');
            $(this).toggleClass('active');
            $('.sort-dropdown').toggleClass('active');
    
        });
    
        $('.search-wrapper').click(function(){
            event.stopPropagation();
            $(this).addClass('active');
            $('.search-input').addClass('active');
        });
    
        $('.expanded-options-wrapper').click(function(){
            if ($(this).hasClass('active')){
                $(this).removeClass('active');
            } else {
                $('.expanded-options-wrapper').removeClass('active');
                $(this).addClass('active');
            }
        });
    
        $('.column-td-a').click(function(){
            if ($(this).hasClass('active')){
                $(this).removeClass('active');
            } else {
                $('.column-td-a').removeClass('active');
                $(this).addClass('active');
            }
        });
    
        $('.workflow-order-header ul li').click(function(){
            $('.workflow-order-header ul li').removeClass('active');
            $(this).addClass('active');
        });
    
    
        function closeMenu(){
            $('.dropdown, .filter-btn-wrapper, .btn-person-filter, .search-input, .search-wrapper').removeClass('active');
        }
    
        $(document.body).click( function() {
            closeMenu();
        });
    
        $('.dropdown').click( function() {
            event.stopPropagation();
        });
    });

    $('.material-card-section .card .card-header .col-right').click(function(){

        let activeCard = $(this).parents('.card');
        if ($(activeCard).hasClass('active')) {
            $(activeCard).removeClass('active');
        } else if (!$(activeCard).hasClass('active')){
            $('.card').removeClass('active'); 
            $(activeCard).addClass('active'); 
        }
		
    });

    $('.ticket-number-column').click(function(){
        let currentActive = $(this).closest('.table-row-wrapper');
        if ($(currentActive).hasClass('active')) {
            $('.table-row-wrapper').removeClass('active');
        } else {
            $('.table-row-wrapper').removeClass('active');
            $(currentActive).addClass('active');
        }
		
    });



});