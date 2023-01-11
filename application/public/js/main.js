$( document ).ready(function() {
    const emptyLength = 0;
    const ZERO = 0;

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
            url: `/tickets/update/${ticketId}`,
            type: 'POST',
            data: ticketAttributes,
            success: function(updatedTicket) {
                if (callback) {
                    callback(updatedTicket);
                }
            },
            error: function(error) {
                const errorMessage = error.responseText ? error.responseText : 'N/A';
                alert(`An error occurred while attempting to update the ticket: "${errorMessage}"`);
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

    function populateDepartmentStatusesDropdown(departmentName) {
        $.ajax({
            url: '/tickets/find-department-statuses',
            type: 'POST',
            data: {
                departmentName: departmentName
            },
            success: function(response) {
                if (response.error) {
                    alert(`Failed to find department statuses: ${response.error}`);
                } else {
                    const departmentStatuses = response.departmentStatuses;
                    const departmentStatusDropdown = $('#department-status-selection');

                    departmentStatusDropdown.empty();
                    departmentStatusDropdown.append($('<option />').val('').text('-'));

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

    $('#department-selection').on('change', () => {
        const selectedDepartmentName = $('#department-selection').val();

        if (!selectedDepartmentName) {
            return;
        }
        populateDepartmentStatusesDropdown(selectedDepartmentName);
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

    $('.table-body').on('click', '.table-row-wrapper .table-row .column-td-a', function() {
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
        } else {
            $('.column-td-a').removeClass('active');
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
    $('.close-on-hold-dropdown').click(function() {
        event.stopPropagation();
        $('.on-hold-dropdown').removeClass('active');
    });

    $(function() {
        $('#datepicker').datepicker();
    });

    $('.notification-option').click(function() {
        $('');
        $(this).toggleClass('active');
    });

    $('.status-section').on('click', '.start-ticket', function() {
        $(this).closest('.table-row-wrapper').find('.start-job-bg-overlay').addClass('active');
    });

    $('.status-section').on('click', '.start-ticket-button', function() {
        const ticketObjectId = $(this).data('ticket-id');
        const department = $(this).data('department');

        const ticketAttributesToUpdate = {
            destination: {
                department,
                departmentStatus: 'IN PROGRESS'
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
    
    function getIdentifierUsingTicketDepartmentAndDepartmentStatus(department, departmentStatus) {
        // department statuses
        const NEEDS_ATTENTION = 'NEEDS ATTENTION';
        const WAITING_ON_APPROVAL = 'WAITING ON APPROVAL';
        const WAITING_ON_CUSTOMER = 'WAITING ON CUSTOMER';
        const IN_PROGRESS = 'IN PROGRESS';
        const PROOFING_COMPLETE = 'PROOFING COMPLETE';
        const PRINTING_READY = 'PRINTING READY';
        const PRINTER_ONE_SCHEDULE = 'PRINTER ONE SCHEDULE';
        const PRINTER_TWO_SCHEDULE = 'PRINTER TWO SCHEDULE';
        
        const SEND_TO_PRINTING = 'SEND TO PRINTING';
        const NEEDS_PROOF = 'NEEDS PROOF';
        const ON_HOLD = 'ON HOLD';
        const PACKAGING_READY = 'PACKAGING READY';
        
        const CUTTING_READY = 'CUTTING READY';
        const DELTA_ONE_SCHEDULE = 'DELTA ONE SCHEDULE';
        const DELTA_TWO_SCHEDULE = 'DELTA TWO SCHEDULE';
        const ROTOFLEX_ONE_SCHEDULE = 'ROTOFLEX ONE SCHEDULE';
        const WINDING_READY = 'WINDING READY';
        const FARMED_OUT_TICKETS = 'FARMED OUT TICKETS';
        const BILLING_READY = 'BILLING READY';
        const SHIPPING_READY = 'SHIPPING READY';
        
        // departments
        const ORDER_PREP_DEPARTMENT = 'ORDER-PREP';
        const ART_PREP_DEPARTMENT = 'ART-PREP';
        const PRE_PRINTING_DEPARTMENT = 'PRE-PRINTING';
        const PRINTING_DEPARTMENT = 'PRINTING';
        const CUTTING_DEPARTMENT = 'CUTTING';
        const WINDING_DEPARTMENT = 'WINDING';
        const PACKAGING_DEPARTMENT = 'PACKAGING';
        const SHIPPING_DEPARTMENT = 'SHIPPING';
        const BILLING_DEPARTMENT = 'BILLING';

        const destinationToIdentifierMapping = 
        {
            [ORDER_PREP_DEPARTMENT]: {
                [NEEDS_ATTENTION]: 'order-prep-needs-attention',
                [ON_HOLD]: 'order-prep-on-hold',
                [PROOFING_COMPLETE]: 'order-prep-proofing-complete',
                [WAITING_ON_CUSTOMER]: 'order-prep-waiting-on-customer',
                [WAITING_ON_APPROVAL]: 'order-prep-waiting-on-approval'
            },
            [ART_PREP_DEPARTMENT]: {
                [NEEDS_ATTENTION]: 'art-prep-needs-attention',
                [ON_HOLD]: 'art-prep-on-hold',
                [IN_PROGRESS]: 'art-prep-in-progress',
                [NEEDS_PROOF]: 'art-prep-needs-proof'
            },
            [PRE_PRINTING_DEPARTMENT]: {
                [NEEDS_ATTENTION]: 'pre-printing-needs-attention',
                [ON_HOLD]: 'pre-printing-on-hold',
                [IN_PROGRESS]: 'pre-printing-in-progress',
                [SEND_TO_PRINTING]: 'pre-printing-send-to-printing'
            },
            [PRINTING_DEPARTMENT]: {
                [ON_HOLD]: 'printing-on-hold',
                [IN_PROGRESS]: 'printing-in-progress',
                [PRINTING_READY]: 'printing-ready',
                [PRINTER_ONE_SCHEDULE]: 'printing-printer-one-schedule',
                [PRINTER_TWO_SCHEDULE]: 'printing-printer-two-schedule'
            },
            [CUTTING_DEPARTMENT]: {
                [ON_HOLD]: 'cutting-on-hold',
                [IN_PROGRESS]: 'cutting-in-progress',
                [CUTTING_READY]: 'cutting-ready',
                [DELTA_ONE_SCHEDULE]: 'cutting-delta-one-schedule',
                [DELTA_TWO_SCHEDULE]: 'cutting-delta-two-schedule',
                [ROTOFLEX_ONE_SCHEDULE]: 'cutting-rotoflex-one-schedule'
            },
            [WINDING_DEPARTMENT]: {
                [ON_HOLD]: 'winding-on-hold',
                [IN_PROGRESS]: 'winding-in-progress',
                [WINDING_READY]: 'winding-ready'
            },
            [PACKAGING_DEPARTMENT]: {
                [ON_HOLD]: 'packaging-on-hold',
                [IN_PROGRESS]: 'packaging-in-progress',
                [PACKAGING_READY]: 'packaging-ready'
            },
            [SHIPPING_DEPARTMENT]: {
                [ON_HOLD]: 'shipping-on-hold',
                [IN_PROGRESS]: 'shipping-in-progress',
                [SHIPPING_READY]: 'shipping-ready',
                [FARMED_OUT_TICKETS]: 'shipping-farmed-out-tickets',
            },
            [BILLING_DEPARTMENT]: {
                [ON_HOLD]: 'billing-on-hold',
                [IN_PROGRESS]: 'billing-in-progress',
                [BILLING_READY]: 'billing-ready'
            }
        };

        const identifier = destinationToIdentifierMapping[department][departmentStatus];

        if (!identifier) {
            alert('Error: Failed to find a table to put the moved ticket into, contact a developer');
        }

        return identifier;
    }

    function findTicketRow(ticketId) {
        return $(`#ticket-row-${ticketId}`);
    }

    function findDepartmentStatusTableTicketBelongsIn(ticket) {
        const {department, departmentStatus} = ticket.destination;
        const identifier = getIdentifierUsingTicketDepartmentAndDepartmentStatus(department, departmentStatus);
        const tableId = `#${identifier}-table`;
        
        return $(tableId);
    }

    function findATicketRowToClone(ticket) {
        const {department, departmentStatus} = ticket.destination;
        const identifier = getIdentifierUsingTicketDepartmentAndDepartmentStatus(department, departmentStatus);
        const tableRowCloneSelector = `.${identifier}-row`;

        return $(tableRowCloneSelector).first().clone();
    }

    function countHowManyRowsExistInTable(ticketTable) {
        const rows = ticketTable.children('.table-row-wrapper');
        return rows.length;
    }

    function getTicketRowId(ticketId) {
        return `ticket-row-${ticketId}`;
    }

    function formatDate(dateAsString, formatConfig) {
        if (!dateAsString) {
            return;
        }
        return new Date(dateAsString).toLocaleDateString('en-us', formatConfig);
    }

    const ticketNumberColumn = '.ticket-number-column';
    const departmentNameColumn = '.department-column';
    const departmentStatusNameColumn = '.department-status-column';
    const holdStatusColumn = '.hold-status-column';
    const lengthColumn = '.length-column';
    const materialColumn = '.material-column';
    const dieColumn = '.die-column';
    const totalRollsColumn = '.total-rolls-column';
    const groupedColumn = '.grouped-column';
    const productCountColumn = '.product-count-column';
    const dueDateColumn = '.due-date-column';
    const fromColumn = '.from-column';
    const dieFinishColumn = '.die-finish-column';
    const sentDateColumn = '.sent-date-column';
    const followUpDateColumn = '.follow-up-date-column';
    const assigneeNameColumn = '.assignee-name-column';
    const assigneeProfilePictureColumn = '.assignee-picture-url-column';

    function getDieCuttingFinishFromTheFirstProduct(products) {
        if (!products || products.length === ZERO) {
            return;
        }

        return products[0].dieCuttingFinish;
    }

    /* eslint-disable complexity */
    function mapTicketRowColumnSelectorToValues(ticket) {
        console.log(ticket);
        const numberOfProducts = ticket.products ? ticket.products.length : ZERO;
        const productDie = (ticket.products && ticket.products.length > ZERO) ? ticket.products[0].productDie : 'N/A';
        const assigneeName = ticket.destination.assignee ? ticket.destination.assignee.fullName : 'N/A';
        const assigneeProfilePicture = ticket.destination.assignee ? ticket.destination.assignee.profilePicture : '';
        const dieCuttingFinish = getDieCuttingFinishFromTheFirstProduct(ticket.products);

        return {
            [ticketNumberColumn]: `#${ticket.ticketNumber}`,
            [departmentNameColumn]: ticket.destination ? ticket.destination.department : undefined,
            [departmentStatusNameColumn]: ticket.destination ? ticket.destination.departmentStatus : undefined,
            [assigneeNameColumn]: assigneeName,
            [assigneeProfilePictureColumn]: assigneeProfilePicture,
            [holdStatusColumn]: 'TODO: .hold-status-column',
            [lengthColumn]: ticket.totalMaterialLength,
            [materialColumn]: ticket.primaryMaterial,
            [dieColumn]: productDie,
            [totalRollsColumn]: ticket.totalWindingRolls,
            [groupedColumn]: 'TODO: .grouped-column',
            [productCountColumn]: numberOfProducts,
            [dueDateColumn]: formatDate(ticket.shipDate, {month:'short', day:'numeric'}),
            [fromColumn]: 'TODO: .from-column',
            [dieFinishColumn]: dieCuttingFinish,
            [sentDateColumn]: 'TODO: .sent-date-column',
            [followUpDateColumn]: 'TODO: .follow-up-date-column'
        };
    }

    function populateTicketRowAttributes(ticketRowTemplate, ticket) {
        const ticketRow = ticketRowTemplate.clone();
        ticketRow.attr('id', getTicketRowId(ticket._id));
        const columnSelectorToColumnValueMap = mapTicketRowColumnSelectorToValues(ticket);

        const columnClassPostfix = '-column';
        const columns = ticketRowTemplate.find(`[class$=${columnClassPostfix}]`); // See https://stackoverflow.com/a/5376445/9273261

        columns.each(function() {
            const classesOnColumn = $(this).attr('class').split(/\s+/);

            classesOnColumn.forEach((cssClass) => {
                const classSelector = `.${cssClass}`;
                const shouldPopulateThisColumnWithAValue = columnSelectorToColumnValueMap.hasOwnProperty(classSelector);

                if (shouldPopulateThisColumnWithAValue) {
                    const valueToPopulateColumnWith = columnSelectorToColumnValueMap[classSelector];
                    ticketRow.find(classSelector).text(valueToPopulateColumnWith);
                }
            });
        });

        return ticketRow;
    }
    
    function updateTicketRowNumbers() {
        const departmentTables = $('.table-body');
        departmentTables.each(function() {
            const ticketRows = $(this).find('[id^=ticket-row]'); // https://stackoverflow.com/a/5376445/9273261
            ticketRows.each(function(index) {
                $(this).find('.row-number').text(index + 1);
            });
        });
    }

    function getAProductRowClone() {
        return $('#product-row-template').first().clone();
    }

    function buildProductRows(products) {
        let productRows = [];
        
        products && products.forEach((product, index) => {
            const productRow = getAProductRowClone();
            productRow.find('.view-product-link').attr('href', `/products/${product._id}`);
            productRow.find('.product-row-number-column').text(index + 1);
            productRow.find('.product-number-column').text(product.productNumber);
            productRow.find('.frames-column').text(product.frameCount);
            productRow.find('.label-quanity-column').text(product.labelQty);

            const proofUrl = product.proof ? product.proof.url : undefined;

            if (proofUrl) {
                productRow.find('.product-proof-column a').attr('href', proofUrl);
            } else {
                productRow.find('.product-proof-column').text('N/A');
            }

            productRows.push(productRow);
        });

        return productRows;
    }

    function addProductRowsToTicketRow(ticketRow, productRows) {
        if (!productRows || productRows.length === emptyLength) {
            return;
        }

        const productsTable = ticketRow.find('.products-table');
        
        productsTable.empty();

        productsTable.append(...productRows);
    }

    function updateTicketRowNumbers() {
        const departmentTables = $('.table-body');
        departmentTables.each(function() {
            const ticketRows = $(this).find('[id^=ticket-row]'); // https://stackoverflow.com/a/5376445/9273261
            ticketRows.each(function(index) {
                $(this).find('.row-number').text(index + 1);
            });
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

    function populateTicketRowDropdownOptions(ticketRow, ticket) {
        ticketRow.find('.view-ticket-link').attr('href',`/tickets/${ticket._id}`);
        ticketRow.find('.edit-ticket-link').attr('href',`/tickets/update/${ticket._id}`);
        ticketRow.find('.archive-ticket-link').attr('href',`/tickets/delete/${ticket._id}`);

        ticketRow.find('.start-modal-ticket-number').attr('href', ticket.ticketNumber);
    }

    function moveTicket(ticket) {
        const ticketId = ticket._id;
        const ticketRowToRemove = findTicketRow(ticketId);
        
        ticketRowToRemove.remove();

        const departmentStatusTable = findDepartmentStatusTableTicketBelongsIn(ticket);
        const ticketRowTemplate = findATicketRowToClone(ticket);

        const ticketRow = populateTicketRowAttributes(ticketRowTemplate, ticket);
        const productRows = buildProductRows(ticket.products);

        addProductRowsToTicketRow(ticketRow, productRows);
        populateTicketRowDropdownOptions(ticketRow, ticket);

        departmentStatusTable.append(ticketRow);
        ticketRow.show();
        productRows.forEach((productRow) => productRow.show());

        updateDepartmentTicketCounts();
        updateDepartmentSectionTicketCounts();
        showOrHideDepartmentSections();
        updateTicketRowNumbers();
    }

    function findTableWithinSection(departmentStatusSection) {
        return departmentStatusSection.find('.table-body');
    }

    function showOrHideDepartmentSections() {
        const emptyLength = 0;
        $('.status-section').each(function() {
            const departmentStatusSection = $(this);
            const departmentStatusTable = findTableWithinSection(departmentStatusSection);
            const tableIsNotEmpty = countHowManyRowsExistInTable(departmentStatusTable) > emptyLength;

            if (tableIsNotEmpty) {
                departmentStatusSection.show();
            } else {
                departmentStatusSection.hide();
            }
        });
    }

    function updateDepartmentSectionTicketCounts() {
        $('.status-section').each(function() {
            const departmentStatusSection = $(this);
            const departmentStatusTable = findTableWithinSection(departmentStatusSection);
            const numberOfRowsInSection = countHowManyRowsExistInTable(departmentStatusTable);

            departmentStatusSection.find('.category-ticket-count').text(numberOfRowsInSection);
        });
    }

    function updateDepartmentTicketCounts() {
        const departments = $('.department-wrapper');
        
        departments.each(function() {
            let numberOfTicketsInDepartment = 0;
            const department = $(this);
            const departmentStatusTables = department.find('.table-body');
            departmentStatusTables.each(function() {
                const table = $(this);
                const numberOfRowsInTable = countHowManyRowsExistInTable(table);
                numberOfTicketsInDepartment += numberOfRowsInTable;
            });

            department.find('#departmentTotalTickets').text(numberOfTicketsInDepartment);
        });
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
});
