import React from 'react';
import { Outlet } from 'react-router-dom';
import { HorizontalNavbar } from '../Navbars/HorizontalNavbar/HorizontalNavbar';

export const TopNavbarLayout = () => {
  return (
    <>
      <HorizontalNavbar />
      <Outlet />
    </>
  )
};