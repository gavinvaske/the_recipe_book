import React from 'react';
import { Outlet } from 'react-router-dom';
import { HorizontalNavbar } from '../Navbars/HorizontalNavbar/HorizontalNavbar';
import { Footer } from '../Footer/Footer';

export const TopNavbarLayout = () => {
  return (
    <>
      <HorizontalNavbar />
      <Outlet />
    </>
  )
};