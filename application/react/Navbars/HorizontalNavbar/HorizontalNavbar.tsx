import React from 'react';
import './HorizontalNavbar.scss';
import { Link } from 'react-router-dom';


export const HorizontalNavbar = () => {
  return (
    <nav className="navbar-main">
      <div className="column column-left">
          <ul className="full-width flex-center-left-row main-navbar-links">
              <li className="navbar-links"><a href="/tickets" className="flex-center-center-row tickets"><i className="fa-regular fa-table-tree"></i> Production</a></li>
              <li className="navbar-links nav-dropdown-trigger" id="material-dropdown-trigger">
              <Link className="material flex-center-center-row" to='/react-ui/inventory'><i className="fa-regular fa-toilet-paper"></i> Inventory</Link>
              </li>
              <li className="navbar-links nav-dropdown-trigger" id="insights-dropdown-trigger">
                  <div className="insights flex-center-center-row">
                      <i className="fa-regular fa-chart-network"></i>Insights
                      <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  <ul className="dropdown-menu insights-dropdown">
                      <li><a href="/recipes/create"><i className="fa-solid fa-list-timeline"></i>Master Log</a></li>
                      <li><a href="/recipes?pageNumber=1"><i className="fa-regular fa-layer-group"></i>Dashboard</a></li>
                      <li><a href="/material-orders"><i className="fa-regular fa-bell"></i>Purchase</a></li>
                      <li><a href="/recipes"><i className="fa-regular fa-magnifying-glassName"></i>Recipes</a></li>
                  </ul>
              </li>
          </ul>
      </div>
      <div className="column column-center">
        <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 304.29">
            <defs>
            <style>
                {`
                .cls-1, .cls-2, .cls-3 { stroke-width: 0px; }
                .cls-2 { fill: #157efb; }
                .cls-3 { fill: #157efb; }
                `}
            </style>
            </defs>
            <g id="Layer_1-2">
            <path className="cls-1" d="M248.98,203.45c-1.7,3.46-2.75,6.1-4.21,8.47-16.7,27.01-40.25,44.73-71.68,50.38-45.39,8.15-83.67-4.46-111.9-41.99-21.08-28.03-25.54-60.09-18.79-93.72,7.2-35.87,27.67-61.92,60.97-77.54,14.5-6.8,29.86-9.49,45.83-9.7,12.06-.16,20.6-9.05,20.33-20.27C169.26,7.89,160.77-.02,148.83,0c-36.41.05-68.79,11.54-96.46,35.21C24.68,58.88,8.33,89.11,2.48,125.03c-5.12,31.49-2.71,62.43,10.95,91.32,22.39,47.37,59.15,77.25,111.66,85.69,35.93,5.77,70.36.74,101.66-18.43,42.3-25.91,66.53-64.01,72.13-113.31,2.82-24.8.46-49.35-8.5-72.94-2.95-7.76-8.59-12.49-16.96-13.11-15.43-1.15-25.2,12.94-19.99,28.65,4.96,14.95,6.91,30.28,6.11,45.99-.38,7.57-.75,7.95-8.13,7.96-14.98.03-29.97.02-44.95.02-38.14,0-76.28,0-114.42.02-7.92,0-8.63.77-6,8.44,2.06,6.03,4.09,12.24,7.32,17.67,20.33,34.19,70.84,41.12,101.84,14.06,3.31-2.89,6.55-4.3,10.94-4.22,11.87.22,23.74.06,35.61.1,2.04,0,4.08.28,7.24.52ZM214.6,130.71c-5.06-27.56-30.9-57.12-76.72-50.79-25.98,3.59-49.85,26.99-51.12,50.79h127.84ZM224.65,69.95c15.13-.05,27.99-13.04,27.78-28.06-.21-14.89-12.96-27.43-27.85-27.4-15.51.04-27.91,12.84-27.71,28.61.18,14.26,13.25,26.9,27.78,26.85Z" />
            <path className="cls-2" d="M248.98,203.45c-3.16-.24-5.2-.51-7.24-.52-11.87-.04-23.74.12-35.61-.1-4.39-.08-7.62,1.33-10.94,4.22-31,27.06-81.51,20.13-101.84-14.06-3.23-5.43-5.26-11.64-7.32-17.67-2.62-7.67-1.91-8.44,6-8.44,38.14-.01,76.28-.01,114.42-.02,14.98,0,29.97,0,44.95-.02,7.38-.01,7.75-.39,8.13-7.96.8-15.71-1.15-31.04-6.11-45.99-5.21-15.71,4.56-29.8,19.99-28.65,8.36.62,14.01,5.35,16.96,13.11,8.95,23.59,11.31,48.14,8.5,72.94-5.6,49.31-29.83,87.4-72.13,113.31-31.3,19.17-65.73,24.21-101.66,18.43-52.51-8.44-89.28-38.32-111.66-85.69C-.22,187.46-2.64,156.52,2.48,125.03c5.85-35.92,22.2-66.15,49.88-89.82C80.04,11.54,112.42.05,148.83,0c11.95-.02,20.43,7.89,20.7,19.07.27,11.22-8.27,20.11-20.33,20.27-15.97.21-31.33,2.9-45.83,9.7-33.3,15.62-53.77,41.67-60.97,77.54-6.75,33.64-2.3,65.69,18.79,93.72,28.23,37.53,66.51,50.14,111.9,41.99,31.44-5.64,54.98-23.37,71.68-50.38,1.47-2.37,2.51-5.01,4.21-8.47Z" />
            <path className="cls-2" d="M214.6,130.71h-127.84c1.27-23.81,25.14-47.21,51.12-50.79,45.82-6.33,71.66,23.23,76.72,50.79Z" />
            <path className="cls-3" d="M224.65,69.95c-14.53.05-27.6-12.58-27.78-26.85-.2-15.77,12.21-28.57,27.71-28.61,14.88-.04,27.63,12.51,27.85,27.4.21,15.02-12.65,28.01-27.78,28.06Z" />
            </g>
        </svg>

      </div>
      <div className="column column-right">
      <ul className="primary">
            <li className='settings-option settings tooltip-bottom'>
                <span className='tooltiptext'>Settings</span>
                <i className="fa-regular fa-gear"></i>
            </li>
            <li className="activity-option tooltip-bottom">
                <span className="tooltiptext">Calendar</span>
                <i className="fa-regular fa-calendar"></i>
            </li>
            <li className="team-chat-option tooltip-bottom">
                <span className="tooltiptext">Team Chat</span>
                <div className='notification-counter'>3</div>
                <i className="fa-regular fa-message"></i>
            </li>
            <li className="notification-option tooltip-bottom">
                <span className="tooltiptext">Notifications</span>
                <div className='notification-counter'>1</div>
                <i className="fa-regular fa-bell"></i>
                <div className="notification-teaser-dropdown">
                    <div className="header">
                    Notifications
                    </div>
                    <ul>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                        <li>Sam Tarrant asked you do better</li>
                    </ul>
                    <div className="footer flex-center-center-row">
                    <a href='#' className="btn btn-primary">See All Notifications</a>
                    </div>
                </div>
            </li>
            <li className="list-item-user-detail nav-dropdown-trigger">
                <div className="user-frame">
                    <div className="user-details">
                        <span className="user-name"></span>
                        <span className="job-role"></span>
                    </div>
                    <div className="user-profile-picture profile-picture">
                        <div className="active-user"></div>
                    </div>
                </div>
                <ul className="dropdown-menu user-options">
                    <li><a href="/users/profile/"><i className="fa-regular fa-user"></i>Account</a></li>
                    <li><a href="#"><i className="fa-regular fa-books"></i>Resources</a></li>
                    <li><a href="/users/logout"><i className="fa-regular fa-right-from-bracket"></i>Log Out</a></li>
                </ul>
            </li>
       </ul>
      </div>
      <div className='full-page-curtain'>
        <div className='full-page-curtain-wrapper'>
            <div className='full-page-curtain-container flex-center-center-row full-width'>
                <div className='left-col parent flex-top-right-row'>
                    <div className='left-options-frame flex-top-left-row'>
                        <div className='left-col child'>
                            <h5>SETTINGS</h5>
                            <ul>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Finishes</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Materials</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Machines</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Vendors</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Recipes</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Future Link</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='right-col parent flex-top-left-row'>
                    <div className='right-options-frame'>
                        <div className='left-col child'>
                            <h5>ADMIN</h5>
                            <ul>
                                <li>
                                    <a href='' className='dropdown-option flex-center-left-column'>
                                        <h6>Users</h6>
                                        <p>Build project plans, coordinate tasks, and hit deadlines</p>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='footer flex-center-center-row'>
                    <div className='left-col child flex-center-right-row'>
                        <div className='left-options-frame flex-center-left-row'>
                            <a href='#'>Resources</a>
                            <span>|</span>
                            <a href='#'>Account</a>
                        </div>
                    </div>
                    <div className='right-col child flex-center-left-row'>
                        <div className='right-options-frame flex-center-left-row'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </nav>
  )
};