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
                    alert(`An error occurred: ${response.error}`);
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
                    alert(`An error occurred: ${response.error}`);
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

    // $('.user-frame').on('click', function(){
    //     $('.dropdown-menu.user-options').toggleClass('active');
    // });

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

    

    $(document).mouseup(function(e) {
        var container = $('.column-td-a.active');
        var emptyLength = 0;
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === emptyLength) {
            // container.hide();
            $('.column-td-a.active').removeClass('active');
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

    $('.ticket-dropdown-options').click(function() {
        $('.column-td-a').removeClass('active');
    });

    $('.collapse-ticket').click(function(){
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

    $('.show-products').click(function(){
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

    $('.move-to-department-trigger').click(function(){
        let currentlyActive = $(this).find('.departments-dropdown');
        if ($(currentlyActive).hasClass('active')) {
            $(currentlyActive).removeClass('active');
        } else {
            $(currentlyActive).addClass('active');
            $(this).closest('.move-ticket').addClass('active');
        }
    });

    $('.move-to-list-trigger').click(function(){
        let currentlyActive = $(this).find('.list-dropdown');
        if ($(currentlyActive).hasClass('active')) {
            $(currentlyActive).removeClass('active');
        } else {
            $(currentlyActive).addClass('active');
            $(this).closest('.move-ticket').addClass('active');
        }
    });

    $('.department-option').click(function(){
        $('.department-option').removeClass('active');
        $(this).addClass('active');
    });

    $('.view-ticket').hover(function(){
        $('.move-ticket').removeClass('active');
        $('.departments-dropdown').removeClass('active');
    });

    $('.back-out-hover').hover(function(){
        $('.move-ticket').removeClass('active');
        $('.departments-dropdown').removeClass('active');
    });

    $('.move-to-department-trigger ul li').click(function(){
        event.preventDefault();
        $('.department-status-dropdown').addClass('active');
    });

    $('.sub-drpdwn-back-btn').click(function() {
        $('.department-status-dropdown').removeClass('active');
        $('.departments-dropdown').addClass('storm');
    });

    $('.notification-option').click(function() {
        $('');
        $(this).toggleClass('active');
    });

    $('.start-ticket').click(function() {
        $(this).closest('.table-row-wrapper').find('.start-job-bg-overlay').addClass('active');
    });

    $('.start-job-bg-overlay .fa-xmark-large').click(function(){
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
                    alert(`An error occurred: ${response.error}`);
                } else {
                    departmentStatusList.empty();
                    const departmentStatuses = response.departmentStatuses;

                    departmentStatuses.forEach((departmentStatus) => {
                        const clone = listItemTemplate.clone();
                        clone.data('status-name', departmentStatus);
                        clone.text(departmentStatus);
                        departmentStatusList.append(clone);
                    });
                }
            },
            error: function(error) {
                alert('Uh oh, an unknown error occurred, see the console for more details');
                console.log(JSON.stringify(error));
            }
        });
    }

    $('.departments-dropdown li').click(function() {
        let departmentSelection = $(this).data('department-name');
        const departmentStatusHtmlList = $(this).parent('.department-dropdown-list').parent('.departments-dropdown').siblings('.department-status-dropdown').find('.status-dropdown-list');
        const clone = departmentStatusHtmlList.find('.status-option').first().clone();

        populateDepartmentStatusList(departmentSelection, departmentStatusHtmlList, clone);
    });
    
    function getIdentifierUsingTicketDepartmentAndDepartmentStatus(department, departmentStatus) {
        const NEEDS_ATTENTION = 'NEEDS ATTENTION';
        const SEND_TO_CUSTOMER = 'SEND TO CUSTOMER';
        const WAITING_ON_APPROVAL = 'WAITING ON APPROVAL';
        const WAITING_ON_CUSTOMER = 'WAITING ON CUSTOMER';
        const READY_TO_ORDER_PLATE_OR_DIE = 'READY TO ORDER PLATE OR DIE';
        const IN_PROGRESS = 'IN PROGRESS';

        const SETUP = 'SET-UP';
        const RUNTIME = 'RUNTIME';
        const TEAR_DOWN = 'TEAR-DOWN';

        const NEEDS_DIE_LINE = 'NEEDS DIE LINE';
        const NEEDS_PLATE = 'NEEDS PLATE';
        const SEND_TO_PRESS = 'SEND TO PRESS';
        const READY_FOR_SCHEDULING = 'READY FOR SCHEDULING';
        const SCHEDULE_PRESS_ONE = 'SCHEDULE PRESS ONE';
        const SCHEDULE_PRESS_TWO = 'SCHEDULE PRESS TWO';
        const SCHEDULE_PRESS_THREE = 'SCHEDULE PRESS THREE';
        const NEEDS_PROOF = 'NEEDS PROOF';
        const ON_HOLD = 'ON HOLD';
        const SCHEDULE_DELTA_ONE = 'SCHEDULE DELTA ONE';
        const SCHEDULE_DELTA_TWO = 'SCHEDULE DELTA TWO';
        const SCHEDULE_ROTOFLEX = 'SCHEDULE ROTOFLEX';
        const READY_FOR_SHIPPING = 'READY FOR SHIPPING';
        const TOOL_ARRIVALS = 'TOOL ARRIVALS';
        const READY_FOR_BILLING = 'READY FOR BILLING';

        const ORDER_PREP_DEPARTMENT = 'ORDER-PREP';
        const ART_PREP_DEPARTMENT = 'ART-PREP';
        const PRE_PRESS_DEPARTMENT = 'PRE-PRESS';
        const PRINTING_DEPARTMENT = 'PRINTING';
        const CUTTING_DEPARTMENT = 'CUTTING';
        const WINDING_DEPARTMENT = 'WINDING';
        const SHIPPING_DEPARTMENT = 'SHIPPING';
        const BILLING_DEPARTMENT = 'BILLING';
        
        const destinationToIdentifierMapping = 
        {
            [ORDER_PREP_DEPARTMENT]: {
                [NEEDS_ATTENTION]: 'order-prep-needs-attention',
                [SEND_TO_CUSTOMER]: 'order-prep-send-to-customer',
                [WAITING_ON_APPROVAL]: 'order-prep-waiting-on-approval',
                [WAITING_ON_CUSTOMER]: 'order-prep-waiting-on-customer',
                [READY_TO_ORDER_PLATE_OR_DIE]: 'order-prep-ready-to-order',
                [IN_PROGRESS]: 'order-prep-in-progress'
            },
            [ART_PREP_DEPARTMENT]: {
                [NEEDS_ATTENTION]: 'art-prep-needs-attention',
                [IN_PROGRESS]: 'art-prep-in-progress',
                [NEEDS_PROOF]: 'art-prep-needs-proof',
                [NEEDS_DIE_LINE]: 'art-prep-needs-die',
                [NEEDS_PLATE]: 'art-prep-needs-plate'
            },
            [PRE_PRESS_DEPARTMENT]: {
                [NEEDS_ATTENTION]: 'pre-press-needs-attention',
                [IN_PROGRESS]: 'pre-press-in-progress',
                [SEND_TO_PRESS]: 'pre-press-send-to-press'
            },
            [PRINTING_DEPARTMENT]: {
                [SETUP]: 'printing-in-progress',
                [RUNTIME]: 'printing-in-progress',
                [TEAR_DOWN]: 'printing-in-progress',
                [READY_FOR_SCHEDULING]: 'printing-ready-for-scheduling',
                [SCHEDULE_PRESS_ONE]: 'printing-schedule-press-one',
                [SCHEDULE_PRESS_TWO]: 'printing-schedule-press-two',
                [SCHEDULE_PRESS_THREE]: 'printing-schedule-press-three',
                [ON_HOLD]: 'printing-on-hold'
            },
            [CUTTING_DEPARTMENT]: {
                [SETUP]: 'cutting-in-progress',
                [RUNTIME]: 'cutting-in-progress',
                [TEAR_DOWN]: 'cutting-in-progress',
                [READY_FOR_SCHEDULING]: 'cutting-ready-for-scheduling',
                [SCHEDULE_DELTA_ONE]: 'cutting-schedule-delta-one',
                [SCHEDULE_DELTA_TWO]: 'cutting-schedule-delta-two',
                [SCHEDULE_ROTOFLEX]: 'cutting-schedule-rotoflex',
                [ON_HOLD]: 'cutting-on-hold'
            },
            [WINDING_DEPARTMENT]: {
                [IN_PROGRESS]: 'winding-in-progress',
                [READY_FOR_SCHEDULING]: 'winding-ready-for-scheduling',
                [ON_HOLD]: 'winding-on-hold'
            },
            [SHIPPING_DEPARTMENT]: {
                [IN_PROGRESS]: 'shipping-in-progress',
                [READY_FOR_SHIPPING]: 'shipping-ready-for-shipping',
                [ON_HOLD]: 'shipping-on-hold',
                [TOOL_ARRIVALS]: 'shipping-tool-arrivals'
            },
            [BILLING_DEPARTMENT]: {
                [READY_FOR_BILLING]: 'billing-ready-for-billing',
                [IN_PROGRESS]: 'billing-in-progress'
            },
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
    const statusColumn = '.status-column';
    const fromColumn = '.from-column';
    const dueDateColumn = '.due-date-column';
    const followUpDateColumn = '.follow-up-date-column';
    const sentDateColumn = '.sent-date-column';
    const typeColumn = '.type-column';
    const productCountColumn = '.product-count-column';
    const locationColumn = '.location-column';
    const materialColumn = '.material-column';
    const dieColumn = '.die-column';
    const lengthColumn = '.length-column';
    const holdStatusColumn = '.hold-status-column';
    const rolls = '.rolls-column';
    const groupedColumn = '.grouped-column';

    function mapTicketRowColumnSelectorToValues(ticket) {
        console.log(ticket);
        const machineName = (ticket.destination.machines && ticket.destination.machines.length > emptyLength) ? ticket.destination.machines[0].name : '';
        const numberOfProducts = ticket.products ? ticket.products.length : ZERO;
        return {
            [ticketNumberColumn]: ticket.shippingAttention,
            [statusColumn]: ticket.shippingAttention,
            [fromColumn]: '!TODO!',
            [dueDateColumn]: formatDate(ticket.shipDate, {month:'short', day:'numeric'}),
            [followUpDateColumn]: '!TODO!',
            [sentDateColumn]: '!TODO!',
            [typeColumn]: '!TODO!',
            [productCountColumn]: numberOfProducts,
            [locationColumn]: machineName,
            [materialColumn]: ticket.primaryMaterial, // TODO: I think Storm marked this wrong on the mockup, check with him
            [dieColumn]: '!TODO!',
            [lengthColumn]: ticket.totalFeet,
            [holdStatusColumn]: '!TODO!',
            [rolls]: '!TODO!',
            [groupedColumn]: '!TODO!',
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
        
        products && products.forEach((product) => {
            console.log(`product => ${JSON.stringify(product)}`);
            const productRow = getAProductRowClone();

            // TODO: Populate the template with dynamic data

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

    function moveTicket(ticket) {
        const ticketId = ticket._id;
        const ticketRowToRemove = findTicketRow(ticketId);
        
        ticketRowToRemove.remove();

        const departmentStatusTable = findDepartmentStatusTableTicketBelongsIn(ticket);
        const ticketRowTemplate = findATicketRowToClone(ticket);

        const ticketRow = populateTicketRowAttributes(ticketRowTemplate, ticket);
        const productRows = buildProductRows(ticket.products);

        addProductRowsToTicketRow(ticketRow, productRows);

        departmentStatusTable.append(ticketRow);

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
        let departmentSelection = $(this).parent('.status-dropdown-list').parent('.department-status-dropdown').siblings('.departments-dropdown').find('.department-option.active').data('department-name');
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
                // $('.department-wrapper').find('.status-section:visible:last').css('margin-bottom', '0');
            }
        });
    }
});
