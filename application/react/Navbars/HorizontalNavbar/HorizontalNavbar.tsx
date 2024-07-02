import React from 'react';
import './HorizontalNavbar.scss';
import { Link } from 'react-router-dom';

export const HorizontalNavbar = () => {
  return (
    <nav class="navbar-main">
      <div class="column column-left">
          <ul class="full-width flex-center-left-row main-navbar-links">
              <li class="navbar-links"><a href="/tickets" class="flex-center-center-row tickets"><i class="fa-regular fa-table-tree"></i> Production</a></li>
              <li class="navbar-links nav-dropdown-trigger" id="material-dropdown-trigger">
              <Link className="material flex-center-center-row" to='/react-ui/inventory'><i class="fa-regular fa-toilet-paper"></i> Inventory</Link>
              </li>
              <li class="navbar-links nav-dropdown-trigger" id="insights-dropdown-trigger">
                  <div class="insights flex-center-center-row">
                      <i class="fa-regular fa-chart-network"></i>Insights
                      <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  <ul class="dropdown-menu insights-dropdown">
                      <li><a href="/recipes/create"><i class="fa-solid fa-list-timeline"></i>Master Log</a></li>
                      <li><a href="/recipes?pageNumber=1"><i class="fa-regular fa-layer-group"></i>Dashboard</a></li>
                      <li><a href="/material-orders"><i class="fa-regular fa-bell"></i>Purchase</a></li>
                      <li><a href="/recipes"><i class="fa-regular fa-magnifying-glass"></i>Recipes</a></li>
                  </ul>
              </li>
          </ul>
      </div>
      <div class="column column-center">
        

      </div>
      <div class="column column-right">
          <ul class="primary">
              <li class="settings-option settings tooltip-bottom">
                  <span class="tooltiptext">Settings</span>
                  <i class="fa-regular fa-gear"></i>
              </li>
              <li class="activity-option tooltip-bottom">
                  <span class="tooltiptext">Calendar</span>
                  <i class="fa-regular fa-calendar"></i>
              </li>
              <li class="team-chat-option tooltip-bottom">
                  <span class="tooltiptext">Team Chat</span>
                  <div class="notification-counter">3</div>
                  <i class="fa-regular fa-message"></i>
              </li>
              <li class="notification-option tooltip-bottom">
                  <span class="tooltiptext">Notifications</span>
                  <div class="notification-counter">1</div>
                  <i class="fa-regular fa-bell"></i>
                  <div class="notification-teaser-dropdown">
                      <div class="header">
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
                      <div class="footer flex-center-center-row">
                      <a href="#" class="btn btn-primary">See All Notifications</a>
                      </div>
                  </div>
              </li>

        </ul>
      </div>
    </nav>
  )
};