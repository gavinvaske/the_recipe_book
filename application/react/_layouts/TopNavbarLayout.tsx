import React from 'react';
import { Outlet } from 'react-router-dom';
import { HorizontalNavbar } from '../Navbars/HorizontalNavbar/HorizontalNavbar';
import { Navbar } from '../Navbars/Navbar/Navbar';

export const TopNavbarLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
};