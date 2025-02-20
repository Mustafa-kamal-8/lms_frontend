import {
    Home,
    Book,
    User,
    Bell,
  } from "lucide-react"; // Import necessary icons
  
  import { ElementType } from "react";
  
  interface NavSubItems {
    name?: string;
    link?: string;
  }
  
  interface NavItem {
    name?: string;
    link?: string;
    icon?: ElementType;
    subItems?: NavSubItems[];
  }
  
  export const NavItems: NavItem[] = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: Home,
    },
    {
      name: "Course",
      link: "/course",
      icon: Book, // Book icon for courses
    },
    {
      name: "Instructor",
      link: "/instructor",
      icon: User, // User icon for instructors
    },
    {
      name: "Notice",
      link: "/notice",
      icon: Bell, // Bell icon for notices
    },
    // {
    //   name: "Instructor Notice",
    //   link: "/notices",
    //   icon: Bell, // Bell icon for notices
    // },
  ];
  