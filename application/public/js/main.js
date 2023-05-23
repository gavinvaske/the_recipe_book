$( document ).ready(function() {
    const emptyLength = 0;

    $('.workflow-navigation ul li').on('click', function() {
        $('.department-end-frame').remove();
        let currentDepartmentName = $(this).text();
        $('#department-select').text(' - ' + currentDepartmentName);
        const selectedDepartment = $(this).data('department');
        const cssTransitionDelayInMs = 200;
        $('.department-wrapper').hide(cssTransitionDelayInMs);

        $(`.department-wrapper*[data-department="${selectedDepartment}"]`).show(cssTransitionDelayInMs);
    });

    function updateTicket(ticketAttributes, ticketId, callback) {
        $.ajax({
            url: `/tickets/${ticketId}`,
            type: 'PATCH',
            data: ticketAttributes,
            success: function(updatedTicket) {
                if (callback) {
                    callback(updatedTicket);
                }
            },
            error: function(error) {
                const errorMessage = error.responseText ? error.responseText : 'N/A';
                alert(`An error occurred while attempting to update the ticket, the error is: "${errorMessage}"`);
            }
        });
    };

    function findTicket(ticketId, callback) {
        $.ajax({
            url: `/tickets/${ticketId}?responseDataType=JSON`,
            type: 'GET',
            success: function(ticket) {
                if (callback) {
                    callback(ticket);
                }
            },
            error: function(error) {
                const errorMessage = error.responseText ? error.responseText : 'N/A';
                alert(`An error occurred while attempting to find a ticket with id = ${ticketId}. The error message is: "${errorMessage}"`);
            }
        });
    }

    function createHoldReason(holdReasonAttributes, callback) {
        $.ajax({
            url: '/hold-reasons',
            type: 'POST',
            data: holdReasonAttributes,
            success: function(holdReason) {
                if (callback) {
                    callback(holdReason);
                }
            },
            error: function(error) {
                const errorMessage = error.responseText ? error.responseText : 'N/A';
                alert(`An error occurred while attempting to CREATE the the specified "hold reason". The error that occurred is: ${errorMessage}`);
            }
        });
    }

    function deleteHoldReason(holdReasonObjectId, callback) {
        $.ajax({
            url: `/hold-reasons/${holdReasonObjectId}`,
            type: 'DELETE',
            success: function(response) {
                if (callback) {
                    callback(response);
                }
            },
            error: function(error) {
                const errorMessage = error.responseText ? error.responseText : 'N/A';
                alert(`An error occurred while attempting to DELETE the the specified "hold reason". The error that occurred is: ${errorMessage}`);
            }
        }); 
    }

    function findTheTicketIdOfTheRowThisHtmlElementIsIn(htmlElement) {
        try {
            const ticketId = htmlElement.closest('.table-row-wrapper').data('ticket-id');

            if (!ticketId) {
                throw Error('Could not find a "ticketId" which was required to complete this operation.');
            }

            return ticketId;
        } catch (error) {
            alert(error);
            throw Error(error.message);
        }
    }

    function findTheDepartmentNameThisHtmlElementIsIn(htmlElement) {
        try {
            const departmentName = htmlElement.closest('.department-wrapper').data('department');

            if (!departmentName) {
                throw Error('Could not find a "departmentName" which was required to complete this operation.');
            }
            return departmentName;
        } catch (error) {
            alert(error);
            throw Error(error.message);
        }
    }

    $('.hold-reason-option .fa-trash-can').on('click', function() {
        const holdReasonId = $(this).data('hold-reason-id');

        $('#delete-hold-reason-btn').data('hold-reason-id-to-delete', holdReasonId);
    });

    $('#delete-hold-reason-btn').on('click', function(){
        const holdReasonId = $('#delete-hold-reason-btn').data('hold-reason-id-to-delete');
        
        deleteHoldReason(holdReasonId, () => {
            alert('successful deletion, TODO: storm, close the window using jquery here');
        });
    });

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

    $('#department-status-selection').change(function() {
        const selectedDepartment = $('#department-selection').val();
        const selectedDepartmentStatus = $('#department-status-selection').val();
        const ticketId = $('#department-notes').data('ticket-id');

        const ticketAttributes = {
            destination: {
                department: selectedDepartment,
                departmentStatus: selectedDepartmentStatus
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
                    alert(`failed to update that note: ${response.error}`);
                }
            },
            error: function(error) {
                console.log(error);
                alert('An error occurred while attempting to save the notes');
            }
        });
    });

    function populateDepartmentStatusesDropdown(departmentName, endpoint, departmentStatusDropdownSelector) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                departmentName: departmentName
            },
            success: function(response) {
                if (response.error) {
                    alert(`Failed to populate the department status dropdown: ${response.error}`);
                } else {
                    const {departmentStatuses} = response;
                    const departmentStatusDropdown = $(departmentStatusDropdownSelector);

                    departmentStatusDropdown.empty();

                    departmentStatuses.forEach((departmentStatus) => {
                        departmentStatusDropdown.append($('<option />').val(departmentStatus).text(departmentStatus));
                    });
                }
            },
            error: function(error) {
                alert('Uh oh, an unknown error occurred, see the console for more details');
                console.log(JSON.stringify(error));
            }
        });
    }

    $('#die-line-department-selection').on('change', () => {
        const selectedDepartmentName = $('#die-line-department-selection').val();
        const endpointToQueryForDepartmentStatuses = '/die-lines/department-statuses';
        populateDepartmentStatusesDropdown(selectedDepartmentName, endpointToQueryForDepartmentStatuses, '#die-line-department-status-selection');
    });

    $('#spot-plate-department-selection').on('change', () => {
        const selectedDepartmentName = $('#spot-plate-department-selection').val();
        const endpointToQueryForDepartmentStatuses ='/spot-plates/department-statuses';
        populateDepartmentStatusesDropdown(selectedDepartmentName, endpointToQueryForDepartmentStatuses, '#spot-plate-department-status-selection');
    });

    $('#department-selection').on('change', () => {
        const selectedDepartmentName = $('#department-selection').val();

        if (!selectedDepartmentName) {
            return;
        }
        populateDepartmentStatusesDropdown(selectedDepartmentName, '/tickets/find-department-statuses', '#department-status-selection');
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
                    alert(`Failed to upload the proof: ${response.error}`);
                } else {
                    alert('Upload was successful. TODO: implement a success flash message @Storm');
                }
            },
            error: function(error) {
                alert(`Failed to upload the file. The error message is "${error.responseText ? error.responseText : 'N/A'}"`);
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

    $('.nav-dropdown-trigger').on('click', function() {
        if ($(this).find('.dropdown-menu').hasClass('active')){ 
            $('.dropdown-menu').removeClass('active');
        } else {
            $('.full-page-curtain').removeClass('active');
            $('.dropdown-menu').removeClass('active');
            $(this).find('.dropdown-menu').addClass('active');
        }
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

        $('.expanded-options-dropdown li').click(function(){
            $('.expanded-options-wrapper').removeClass('active');
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

    $('.material-card-section .card .card-header .col-right .fa-calendar').click(function(){

        let activeCard = $(this).parents('.card');
        if ($(activeCard).hasClass('active')) {
            $(activeCard).removeClass('active');
        } else if (!$(activeCard).hasClass('active')){
            $('.card').removeClass('active'); 
            $(activeCard).addClass('active'); 
        }
		
    });

    $('.table-body').on('click', '.table-row-wrapper .table-row .column-td:nth-child(1)', function() {
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
        } else {
            $('.column-td:nth-child(1)').removeClass('active');
            $(this).addClass('active');
        }
    });

    $('.table-body').on('click', '.table-row .ticket-number-column', function(){
        let currentActive = $(this).closest('.table-row-wrapper');
        if ($(currentActive).hasClass('active')) {
            $('.table-row-wrapper').removeClass('active');
        } else {
            $('.table-row-wrapper').removeClass('active');
            $(currentActive).addClass('active');
        }
    });

    $('.status-section').on('click', '.collapse-ticket', function() {
        $('.table-row-wrapper').removeClass('active');
    });

    $('.collapse-group').click(function(){
        $(this).closest('.status-section').addClass('hide');
    });

    $('.collapse-group-cheater').click(function(){
        $(this).closest('.status-section').toggleClass('hide');
    });

    $('.expand-group').click(function(){
        $(this).closest('.status-section').removeClass('hide-all');
        $(this).closest('.status-section').removeClass('hide');
    });

    $('.collapse-all-groups').click(function(){
        $('.status-section').addClass('hide-all');
    });
    
    $('.table-row .column-td:nth-child(3').click(function(){
        let currentActive = $(this).closest('.table-row-wrapper');
        if ($(currentActive).hasClass('active')) {
            $('.table-row-wrapper').removeClass('active');
        } else {
            $('.table-row-wrapper').removeClass('active');
            $(currentActive).addClass('active');
        }
    });
    $('.status-section').on('click', '.show-products', function() {
        let currentActive = $(this).closest('.table-row-wrapper');
        $(currentActive).addClass('active');
    });

    $('.hide-products').click(function(){
        let currentActive = $(this).closest('.table-row-wrapper');
        $(currentActive).removeClass('active');
    });

    $('.expand-all-groups').click(function(){
        $('.status-section').removeClass('hide-all');
        $('.status-section').removeClass('hide');
    });
    $( document ).ready(function() {
        let materialCount = $('.material-card-section .card').length;
        $('#material-count').text(materialCount);
    });

    $('.department-option').click(function(){
        $('.department-option').removeClass('active');
        $(this).addClass('active');
    });

    $('.view-ticket').hover(function(){
        $('.move-ticket').removeClass('active');
        $('.department-drpdwn').removeClass('active');
        $('.department-drpdwn-options').removeClass('active');
        $('.status-drpdwn').removeClass('active');
        $('.department-status-drpdwn').removeClass('active');
    });

    $(document).on('mouseover', '.duration-dropdown-trigger', function() {
        const ticketRowId = $(this).parents('.table-row-wrapper').attr('id');
        const ticketId = ticketRowId.replace('ticket-row-', '');
        const ticketRow = findTicketRow(ticketId);

        if (!ticketId || !ticketRow) {
            alert('Uh oh, failed to refresh the duration information for this ticket');
            return;
        }
        
        findDurationInformationForOneTicket(ticketId, (durationInformation) => {
            ticketRow.find('.date-created-target').text(durationInformation['date-created']);
            ticketRow.find('.overall-duration-target').text(durationInformation['overall-duration']);
            ticketRow.find('.production-duration-target').text(durationInformation['production-duration']);
            ticketRow.find('.department-duration-target').text(durationInformation['department-duration']);
            ticketRow.find('.list-duration-target').text(durationInformation['list-duration']);
        });
    });

    $('.move-to-department-trigger').click(function() {
        event.stopPropagation();
        $(this).find('.department-drpdwn').addClass('active');
        $(this).closest('.ticket-drpdwn-options').find('.department-drpdwn-options').addClass('active');
        $(this).closest('.primary-drpdwn-list-option.move-ticket').addClass('active');
    });
    $('.department-dropdown-header .drpdwn-back-btn').click(function() {
        event.stopPropagation();
        $('.department-drpdwn').removeClass('active');
        $('.status-drpdwn').removeClass('active');
        $('.department-drpdwn-options').removeClass('active');
        $('.primary-drpdwn-list-option.move-ticket').removeClass('active');
    });
    $('.department-dropdown-header .status-drpdwn-back-btn').click(function() {
        event.stopPropagation();
        $('.department-status-drpdwn').removeClass('active');
    });
    $('.move-to-list-trigger').click(function() {
        event.stopPropagation();
        $(this).find('.status-drpdwn').addClass('active');
        $(this).closest('.ticket-drpdwn-options').find('.department-drpdwn-options').addClass('active');
        $(this).closest('.primary-drpdwn-list-option.move-ticket').addClass('active');
    });
      
    $('.department-option').click(function() {
        $('.department-status-drpdwn').addClass('active');
    });

    $('.on-hold-status-cell').click(function() {
        let onHoldSelection = $(this).children('.on-hold-dropdown');
        $(onHoldSelection).addClass('active');
        
    });

    $('.grouping-indicator').click(function() {
        let currentSelection = $(this);
        if ($(currentSelection).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
        
    });
    $('.close-on-hold-dropdown').click(function() {
        event.stopPropagation();
        $('.on-hold-dropdown').removeClass('active');
    });

    $(function() {
        $('#datepicker').datepicker({ 
            changeMonth: true,
            dateFormat: 'dd MM',
        });
    });

    $('.notification-option').click(function() {
        $('');
        $(this).toggleClass('active');
    });

    $('.status-section').on('click', '.start-ticket', function() {
        const departmentName = findTheDepartmentNameThisHtmlElementIsIn($(this));

        get('/machines/all', (machines) => {
            const machinesInThisDepartment = machines.filter((machine) => {
                const shouldKeepThisMachine = machine.department === departmentName;
                return shouldKeepThisMachine;
            });

            const shouldHideMachineList = !machinesInThisDepartment || machinesInThisDepartment.length === 0;

            if (shouldHideMachineList) {
                $('.machine-list').css('display', 'none');
            }

            machinesInThisDepartment.forEach((machine) => {
                $('.machine-list:visible').append(new Option(machine.name, machine._id));
            });
        });

        $(this).closest('.table-row-wrapper').find('.start-job-bg-overlay').addClass('active');
    });

    $('.status-section').on('click', '.start-ticket-button', function() {
        const ticketObjectId = $(this).data('ticket-id');
        const department = $(this).data('department');
        const loggedInUserId = $(this).data('user-id');
        const selectedMachineId = $('.machine-list:visible option:selected').val();

        const ticketAttributesToUpdate = {
            destination: {
                department,
                departmentStatus: 'IN PROGRESS',
                assignee: loggedInUserId,
                machine: selectedMachineId ? selectedMachineId : undefined
            }
        };

        updateTicket(ticketAttributesToUpdate, ticketObjectId, () => {
            window.location.href = `/tickets/in-progress/${ticketObjectId}`;
        });
    });

    $('.status-section').on('click', '.start-job-bg-overlay .fa-xmark-large', function() {
        $('.start-job-bg-overlay').removeClass('active');
    });

    $('.start-job-bg-overlay .fa-xmark-large').click(function(){
        $('.start-job-bg-overlay').removeClass('active');
    });
    
    $('.status-section').on('click', '.cancel-start-ticket-button', function() {
        $('.start-job-bg-overlay').removeClass('active');
    });

    $('.settings-option.settings').click(function(){
        $('.dropdown-menu').removeClass('active');
        $('.full-page-curtain').toggleClass('active');
    });

    $('.sidebar-main .title-frame').click(function() {
        $('.expand-sidebar').toggleClass('active');
        $('.view-tickets').toggleClass('active');
        $('.sidebar-main').toggleClass('active');
        $('.workflow-order-header.card').toggleClass('active');
        $('.scroll-curtain').toggleClass('active');
    });
    $('.sidebar-option').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $('.sidebar-option').removeClass('active');
            $(this).addClass('active');
        }
    });

    $('.click-tab').click(function(){
        const delay = 0;
        $('.click-tab').removeClass('active');
        $(this).addClass('active');
        
        
        if ($('.ticket-tab').hasClass('active')) {
            $('.ticket-details-wrapper').show();
            $('#proof').hide();
            $('.proof-placeholder').show();
        } else {
            $('.ticket-details-wrapper').hide();
            $('.in-progress-view .right-col .middle-col .card').addClass('active');
            $('.proof-placeholder').hide();
            $('#proof').show();
        }
        

        const productNumber = $(this).data('product-number');
        const productInfoToShow = $(`.product-info*[data-product-number="${productNumber}"]`);

        $('.product-info').hide();
        $(productInfoToShow).delay(delay).show();
    });
    $('.ticket-tab').click(function(){
        $('.in-progress-view .right-col .middle-col .card').removeClass('active');
    });

    $('.close-window').click(function(){
        $('.job-notes').addClass('active');
        $('.in-progress-view .right-col .middle-col').addClass('active');
        $('.in-progress-view .right-col .card.proof').addClass('active');
        $('.product-tab, .ticket-tab, .finish-tab').css({'pointer-events' : 'auto', 'opacity' : '1'});
    });

    $('.finish-tab').click(function(){
        $('.finish-window').addClass('active');
    });

    $('#dom-click-target').on('click', '.clone-button', function() {
        $('.delay-reason-inputs').first().clone().insertAfter('.delay-reason-inputs:last');
    });
    

    $('.hold-reason-option i').click(function() {
        event.stopPropagation();
        $(this).parentsUntil('.wrapper').siblings('.touch-me').addClass('active');
        // $(this).parents('.hold-reason-options').siblings('.confirmation-window').addClass('active');
        var holdReasonValue = $(this).siblings('p').text();
        $('.delete-me-value').text(holdReasonValue);

        $('input.delete').keyup(function() {
            let deleteHoldReasonValue = holdReasonValue;
            if ($('input.delete').keyup().val() === deleteHoldReasonValue) {
                console.log('correct');
            } else {
                console.log('incorrect');
            }
        });
    });
    

    $('.sidebar-main').mouseleave(function(){
        if ($(this).hasClass('active')) {

        } else {
            $('.sidebar-option ').removeClass('active');
        }
    });

    function populateDepartmentStatusList(departmentName, departmentStatusList, listItemTemplate) {
        $.ajax({
            url: '/tickets/find-department-statuses',
            type: 'POST',
            data: {
                departmentName: departmentName
            },
            success: function(response) {
                if (response.error) {
                    alert(`An error occurred4: ${response.error}`);
                } else {
                    departmentStatusList.empty();
                    const departmentStatuses = response.departmentStatuses;

                    departmentStatuses.forEach((departmentStatus) => {
                        const clone = listItemTemplate.clone();
                        clone.data('status-name', departmentStatus);
                        clone.text(departmentStatus);
                        departmentStatusList.append(clone);
                    });

                    departmentStatusList.show();
                }
            },
            error: function(error) {
                alert('Uh oh, an unknown error occurred, see the console for more details');
                console.log(JSON.stringify(error));
            }
        });
    }

    $('.department-dropdown-list li').click(function() {
        let departmentSelection = $(this).data('department-name');
        const departmentStatusList = $(this).parents('.move-department-drpdwn-list-option').find('.status-dropdown-list');
        
        const departmentStatusRowTemplate = departmentStatusList.find('.status-option').first().clone();

        populateDepartmentStatusList(departmentSelection, departmentStatusList, departmentStatusRowTemplate);
    });

    function findTicketRow(ticketId) {
        return $(`#ticket-row-${ticketId}`);
    }

    function get(endpoint, callback, errorCallback) {
        $.ajax({
            url: endpoint,
            type: 'GET',
            success: function(response) {
                if (callback) {
                    callback(response);
                }
            },
            error: function(error) {
                alert(`Error while making GET request to '${endpoint}'. The error message is "${error.responseText ? error.responseText : 'N/A'}"`);

                if (errorCallback) {
                    errorCallback(error);
                }
            }
        });
    }

    function post(endpoint, body, callback, errorCallback) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: body,
            success: function(response) {
                if (callback) {
                    callback(response);
                }
            },
            error: function(error) {
                alert(`Error while making POST request to '${endpoint}'. The error message is "${error.responseText ? error.responseText : 'N/A'}"`);

                if (errorCallback) {
                    errorCallback(error);
                }
            }
        });
    }

    function findDurationInformationForOneTicket(ticketObjectId, callback) {
        $.ajax({
            url: `/tickets/duration/${ticketObjectId}`,
            type: 'GET',
            success: function(durationInformation) {
                if (callback) {
                    callback(durationInformation);
                }
            },
            error: function(error) {
                const errorMessage = error.responseText ? error.responseText : 'N/A';
                alert(`An error occurred while attempting to populate the duration information for the ticket whose object ID is ${ticketObjectId}: "${errorMessage}"`);
            }
        });
    }

    function moveTicket(ticket) { // eslint-disable-line no-unused-vars 
        location.reload();
    }

    $('.status-dropdown-list').on('click', '.status-option', function() {
        let departmentSelection = $(this).parents('.move-department-drpdwn-list-option').find('.department-option.active').data('department-name');
        let statusSelection = $(this).data('status-name');
        let ticketId = $(this).data('ticket-id');
        
        const ticketAttributes = {
            destination: {
                department: departmentSelection,
                departmentStatus: statusSelection
            }
        };

        updateTicket(ticketAttributes, ticketId, (updatedTicket) => {
            moveTicket(updatedTicket);
        });
    });

    const ticketCounts = $('.category-ticket-count');
    if (ticketCounts) {
        ticketCounts.each(function() {
            const ticketCount = $(this).text();
            const shouldSectionBeHidden = parseInt(ticketCount) === emptyLength;
            if (shouldSectionBeHidden) {
                $(this).closest('.status-section').hide();
            }
        });
    }

    $('.status-section').on('change', '#datepicker', function() {
        const selectedDate = $(this).val();
        const ticketId = findTheTicketIdOfTheRowThisHtmlElementIsIn($(this));

        const ticketAttributeToUpdate = {
            followUpDate: selectedDate
        };

        updateTicket(ticketAttributeToUpdate, ticketId);
    });

    $('.status-section').on('click', '.hold-reason-option', function() {
        const selectedHoldReason = $(this).text();
        const departmentName = findTheDepartmentNameThisHtmlElementIsIn($(this));
        const ticketId = findTheTicketIdOfTheRowThisHtmlElementIsIn($(this));

        findTicket(ticketId, (ticket) => {
            let previousDepartmentToHoldReason = ticket.departmentToHoldReason;

            if (!previousDepartmentToHoldReason) { 
                previousDepartmentToHoldReason = {};
            };

            const ticketAttributesToUpdate = {
                departmentToHoldReason: {
                    ...previousDepartmentToHoldReason,
                    [departmentName]: selectedHoldReason
                }
            };

            updateTicket(ticketAttributesToUpdate, ticketId, () => {
                $(this).closest('.on-hold-dropdown').siblings('.on-hold-reason-text').first().text(selectedHoldReason);
            });
        });
    });

    $('.status-section').on('click', '.add-hold-reason-btn', function() {
        const departmentName = findTheDepartmentNameThisHtmlElementIsIn($(this));
        const holdReasonTypedInByUser = $(this).siblings('.hold-reason-input-field').first().val();

        const holdReasonAttributes = {
            department: departmentName,
            reason: holdReasonTypedInByUser
        };

        createHoldReason(holdReasonAttributes, (holdReason) => {
            const holdReasonOptions = $(this).closest('.custom-tag-frame').siblings('.hold-reason-options').first();
            const clonableRow = holdReasonOptions.children('.hold-reason-option').first();
            const newRow = clonableRow.clone();
            newRow.text(holdReason.reason);
    
            holdReasonOptions.append(newRow);
            newRow.show();
        });
    });

    $('.product-tab').on('click', function() {
        const proofUrl = $(this).data('proof-url');

        if (proofUrl) {
            $('#proof').prop('src', proofUrl);
        }
    });

    $('#finish-ticket-button').on('click', function() {
        const ticketId = $(this).data('ticket-id');
        const delayReasonToDurationInMinutes = {};

        $('.delay-reason-inputs').each(function() {
            const delayReason = $(this).find('.reason-select').first().val();
            const delayDurationInMinutes = $(this).find('.time-selection').first().val();

            delayReasonToDurationInMinutes[delayReason] = delayDurationInMinutes;
        });

        const requestBody = {
            totalFramesRan: $('#totalFrames').val(),
            attempts: $('#attempts').val(),
            jobComment: $('#jobComments').val(),
            delayReasonToDurationInMinutes
        };

        post(`/tickets/${ticketId}/next-department`, requestBody, () => {
            alert('Ticket was transitioned was completed successfully! TODO: Storm, how should handle this?');
        });
    });

    var words = [
        '',
        'Quote 1',
        'Quote 2',
        'Quote 3',
        'Quote 4',
        'Quote 5'
    ];

    var getRandomWord = function () {
        return words[Math.floor(Math.random() * words.length)];
    };
    $(function() { // after page load
        let newDelay = 500;

        $('text-box').html(getRandomWord()).fadeIn(newDelay);
    });
});
