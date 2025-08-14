import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { 
    Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon, ChevronDownIcon, EnvelopeIcon, Cog6ToothIcon,
    UserIcon, PuzzlePieceIcon, ShoppingBagIcon, TruckIcon, ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { supabase } from '../pages/supabaseClient';

import logoLightMode from '/src/assets/logo/logo.png';

// --- Constants and Configuration ---

const ADMIN_USER_ID = '96c80823-7af5-4a2b-a0de-ac35231db4a9';

const mainTextNavLinks = [
  { name: "คอนเซปร้าน", href: "/about" },
  { name: "อีเว้นท์ต่างๆ", href: "/NewsAndEvent" },
  { name: "ตารางกะน้องแมว", href: "/schedule" },
  { name: "กฎระเบียบการใช้บริการ", href: "/rules" },
  { 
    name: "เมนู & ไอเทม", 
    href: "#", 
    children: [
      { id: 12, name: "เมนูเครื่องดื่ม", href: "/DrinkMenu" },
      { id: 13, name: "เมนูอาหาร", href: "/MainMenu" },
    ]
  },
  { name: "รายชื่อน้องแมว", href: "/cast" },
  { name: "รับสมัครน้องแมว", href: "/receive" },
];

const userAuthenticatedBaseNavigation = [
  { name: 'โปรไฟล์ของคุณ', href: '/ProfilePage', icon: UserIcon },
  { name: "เกม", href: "/game", icon: PuzzlePieceIcon },
  { name: "สั่งซื้อสินค้า", href: "/ProductListPage", icon: ShoppingBagIcon },
  { name: "ติดตามสินค้า", href: "/OrderTrackingPage", icon: TruckIcon }
];

const navBarBaseClasses = "bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 w-full z-30 border-b border-slate-200 transition-transform duration-300 ease-in-out";
const navLinkBaseClasses = "rounded-lg px-2.5 py-2 text-[14px] font-medium transition-all duration-300 ease-in-out"; 
const navLinkInactiveClasses = "text-slate-600 hover:bg-slate-100 hover:text-indigo-600";
const navLinkActiveClasses = "bg-indigo-50 text-indigo-700 font-semibold";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// --- Reusable Sub-components for Cleaner JSX ---

/** Renders a single navigation link for the desktop view */
const DesktopNavLink = ({ item, current }) => (
  <Link 
    to={item.href} 
    aria-current={current ? 'page' : undefined} 
    className={classNames(navLinkBaseClasses, current ? navLinkActiveClasses : navLinkInactiveClasses)}
  >
    {item.name}
  </Link>
);

/** Renders a dropdown menu for the desktop view */
const DesktopDropdown = ({ item, current, location }) => (
  <Menu as="div" className="relative" key={item.name}>
    <MenuButton className={classNames(navLinkBaseClasses, current ? navLinkActiveClasses : navLinkInactiveClasses, 'inline-flex items-center')}>
      {item.name}
      <ChevronDownIcon className="ml-1.5 size-4 data-[open]:rotate-180 transition-transform duration-200" aria-hidden="true" />
    </MenuButton>
    <MenuItems transition className="absolute left-0 z-20 mt-2 w-56 origin-top-left rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 data-[closed]:scale-90 data-[closed]:opacity-0 data-[enter]:duration-150 data-[enter]:ease-out data-[leave]:duration-100 data-[leave]:ease-in">
      {item.children.map((child) => (
        <MenuItem key={child.id}>
          {({ focus, close }) => (
            <Link 
              to={child.href} 
              onClick={close} 
              className={classNames(
                focus ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700',
                location.pathname === child.href ? 'bg-indigo-100 text-indigo-800 font-medium' : '',
                'block px-4 py-2.5 text-[14px] transition-colors'
              )}
            >
              {child.name}
            </Link>
          )}
        </MenuItem>
      ))}
    </MenuItems>
  </Menu>
);

/** Renders a single item in the profile dropdown menu */
const ProfileMenuItem = ({ item, close }) => {
  const isDanger = item.name === 'ออกจากระบบ';
  const commonClasses = classNames(
    'block px-4 py-2.5 text-[14px] transition-colors duration-150 ease-in-out w-full text-left flex items-center group',
    isDanger ? 'text-red-600 hover:bg-red-50 font-medium' : 'text-slate-700 hover:text-indigo-700 hover:bg-slate-100'
  );

  const content = (
    <>
      {item.icon && <item.icon className={classNames("mr-2.5 size-4 text-slate-500", !isDanger && "group-hover:text-indigo-600")} aria-hidden="true" />}
      {item.name}
    </>
  );

  return (
    <MenuItem>
      {({ focus }) => (
        item.onClick ? (
          <button onClick={() => { item.onClick(); close(); }} className={classNames(commonClasses, { 'bg-slate-100': focus })}>
            {content}
          </button>
        ) : (
          <Link to={item.href} onClick={close} className={classNames(commonClasses, { 'bg-slate-100': focus })}>
            {content}
          </Link>
        )
      )}
    </MenuItem>
  );
};

/** Renders a single navigation link for the mobile menu */
const MobileNavLink = ({ item, current, closeMobileMenu }) => (
  <DisclosureButton
    as={Link}
    to={item.href}
    onClick={closeMobileMenu}
    aria-current={current ? 'page' : undefined}
    className={classNames(
      current ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600',
      'block rounded-md px-3 py-2.5 text-base font-medium'
    )}
  >
    {item.name}
  </DisclosureButton>
);

/** Renders a section with a title for the mobile menu (e.g., for dropdown items) */
const MobileDropdownSection = ({ item, location, closeMobileMenu }) => (
  <div className="py-1">
    <h3 className="px-3 py-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
      {item.name}
    </h3>
    {item.children.map(child => {
      const childCurrent = location.pathname === child.href;
      return (
        <DisclosureButton
          key={child.id}
          as={Link}
          to={child.href}
          onClick={closeMobileMenu}
          aria-current={childCurrent ? 'page' : undefined}
          className={classNames(
            childCurrent ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600',
            'block rounded-md px-3 py-2.5 text-base font-medium'
          )}
        >
          {child.name}
        </DisclosureButton>
      );
    })}
  </div>
);

/** Renders a profile link for the mobile menu, handling buttons and links */
const MobileProfileLink = ({ item, closeMobileMenu }) => {
  const isDanger = item.name === 'ออกจากระบบ';
  const commonClasses = classNames(
    isDanger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600',
    'block rounded-md px-3 py-2.5 text-sm font-medium transition-colors w-full text-left',
    item.icon ? 'flex items-center' : ''
  );

  return (
    <DisclosureButton
      as={item.onClick ? 'button' : Link}
      to={item.onClick ? undefined : item.href}
      onClick={() => {
        if (item.onClick) item.onClick();
        closeMobileMenu();
      }}
      className={commonClasses}
    >
      {item.icon && <item.icon className="mr-2.5 size-4 text-slate-500" aria-hidden="true" />}
      {item.name}
    </DisclosureButton>
  );
};


// --- Main Header Component ---

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [dynamicNavClasses, setDynamicNavClasses] = useState("translate-y-0");
  const [lastScrollY, setLastScrollY] = useState(0);
  const navbarHeight = 80;

  // --- Effects ---

  // Effect for handling auth state changes
  useEffect(() => {
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  // Effect for fetching user avatar
  useEffect(() => {
    if (!user?.id) {
      setAvatarUrl(null);
      return;
    }

    let isSubscribed = true;
    const fetchAvatar = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (isSubscribed) {
          if (error && error.code !== 'PGRST116') throw error;
          setAvatarUrl(profileData?.avatar_url || null);
        }
      } catch (error) {
        if (isSubscribed) {
            console.error('Header: Error fetching avatar:', error.message);
            setAvatarUrl(null);
        }
      }
    };

    fetchAvatar();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => { isSubscribed = false; };
  }, [user]);

  // --- Handlers & Dynamic Data ---

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const loggedInProfileNavItems = user ? (() => {
    const items = [...userAuthenticatedBaseNavigation];
    if (user.id === ADMIN_USER_ID) {
      items.splice(1, 0, { name: 'หน้าจัดการ (Admin)', href: '/AdminOrderManagementPage', icon: Cog6ToothIcon });
    }
    items.push({ name: 'ออกจากระบบ', onClick: handleSignOut, icon: ArrowRightOnRectangleIcon });
    return items;
  })() : [];

  // --- Render ---
  
  return (
    <Disclosure as="nav" className={classNames(navBarBaseClasses, dynamicNavClasses)}>
      {({ open: mobileMenuIsOpen, close: closeMobileMenu }) => {
        
        // Effect for controlling navbar visibility on scroll
        const controlNavbar = useCallback(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > navbarHeight) {
            if (currentScrollY > lastScrollY && !mobileMenuIsOpen) {
              setDynamicNavClasses(`-translate-y-full`);
            } else {
              setDynamicNavClasses("translate-y-0 shadow-md");
            }
          } else {
            setDynamicNavClasses("translate-y-0");
          }
          setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY); 
        }, [lastScrollY, mobileMenuIsOpen]); // navbarHeight is constant, no need to include

        useEffect(() => {
          window.addEventListener("scroll", controlNavbar);
          return () => window.removeEventListener("scroll", controlNavbar);
        }, [controlNavbar]);

        const handleMobileLinkClick = () => closeMobileMenu();

        return (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-20 items-center justify-between">
                
                {/* Mobile menu button */}
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {mobileMenuIsOpen ? <XMarkIcon aria-hidden="true" className="block size-6" /> : <Bars3Icon aria-hidden="true" className="block size-6" />}
                  </DisclosureButton>
                </div>

                {/* Logo and Desktop Main Nav */}
                <div className="flex flex-1 items-center justify-center sm:items-center sm:justify-start">
                  <div className="flex shrink-0 items-center">
                    <Link to="/">
                      <img alt="Your Company Logo" src={logoLightMode} className="h-12 md:h-16 w-auto transition-transform duration-300 hover:scale-105" />
                    </Link>
                  </div>
                  <nav className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-2 md:space-x-3">
                      {mainTextNavLinks.map((item) => {
                        const current = location.pathname === item.href || (item.children && item.children.some(child => location.pathname === child.href));
                        return item.children ? (
                          <DesktopDropdown key={item.name} item={item} current={current} location={location} />
                        ) : (
                          <DesktopNavLink key={item.name} item={item} current={current} />
                        );
                      })}
                    </div>
                  </nav>
                </div>

                {/* Right side icons and Profile Menu */}
                <div className="absolute inset-y-0 right-0 flex items-center space-x-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Link to="/Contact" title="ติดต่อเรา" className="p-1 text-slate-500 hover:text-indigo-600 transition-colors duration-300">
                    <span className="sr-only">ติดต่อเรา</span>
                    <EnvelopeIcon aria-hidden="true" className="size-6" />
                  </Link>

                  {user && (
                    <button type="button" title="การแจ้งเตือน" className="relative rounded-full bg-white p-1 text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300">
                      <span className="sr-only">View notifications</span>
                      <BellIcon aria-hidden="true" className="size-6" />
                    </button>
                  )}

                  <Menu as="div" className="relative">
                    <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:scale-105 transition-transform duration-300">
                      <span className="sr-only">Open user menu</span>
                      {user && avatarUrl ? (
                        <img className="size-9 rounded-full object-cover" src={avatarUrl} alt="User profile" onError={() => setAvatarUrl(null)} />
                      ) : (
                        <UserCircleIcon className="size-9 text-slate-400 hover:text-indigo-500 transition-colors" aria-hidden="true" />
                      )}
                    </MenuButton>
                    <MenuItems transition className="absolute right-0 z-20 mt-2.5 w-60 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 data-[closed]:scale-90 data-[closed]:opacity-0 data-[enter]:duration-150 data-[enter]:ease-out data-[leave]:duration-100 data-[leave]:ease-in">
                      {!user ? (
                        <>
                          <MenuItem>{({ focus, close }) => <Link to="/LoginPage" onClick={close} className={classNames('block px-4 py-2.5 text-[14px] w-full text-left text-slate-700 transition-colors', focus && 'bg-slate-100')}>เข้าสู่ระบบ</Link>}</MenuItem>
                          <MenuItem>{({ focus, close }) => <Link to="/RegisterPage" onClick={close} className={classNames('block px-4 py-2.5 text-[14px] w-full text-left text-slate-700 transition-colors', focus && 'bg-slate-100')}>สมัครสมาชิก</Link>}</MenuItem>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-3 border-b border-slate-200">
                            <p className="text-xs text-slate-500">ลงชื่อเข้าใช้ในฐานะ</p>
                            <p className="text-[14px] font-medium text-slate-900 truncate">{user.email}</p>
                          </div>
                          {loggedInProfileNavItems.map((item) => (
                            <ProfileMenuItem key={item.name} item={item} close={closeMobileMenu} />
                          ))}
                        </>
                      )}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
            
            {/* Mobile menu panel */}
            <DisclosurePanel className="sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm overflow-y-auto transition-all duration-300 ease-in-out data-[closed]:max-h-0 data-[closed]:opacity-0 data-[closed]:-translate-y-4 data-[open]:max-h-[90vh] data-[open]:opacity-100 data-[open]:translate-y-0">
              <nav className="space-y-1 px-2 pt-2 pb-3">
                {mainTextNavLinks.map((item) => {
                  const current = location.pathname === item.href;
                  return item.children ? (
                    <MobileDropdownSection key={item.name} item={item} location={location} closeMobileMenu={handleMobileLinkClick} />
                  ) : (
                    <MobileNavLink key={item.name} item={item} current={current} closeMobileMenu={handleMobileLinkClick} />
                  );
                })}
              </nav>
            
              <div className="pt-4 pb-3 border-t border-slate-200">
                <div className="flex items-center px-5">
                  {user && avatarUrl ? (
                    <img className="size-10 rounded-full object-cover border" src={avatarUrl} alt="User profile" />
                  ) : (
                    <UserCircleIcon className="size-10 text-slate-400" aria-hidden="true" />
                  )}
                  <div className="ml-3">
                    {user?.email ? (
                      <p className="text-sm font-medium text-slate-800 truncate">{user.email}</p>
                    ) : (
                      <p className="text-base font-medium text-slate-700">บัญชี</p>
                    )}
                  </div>
                  {user && (
                    <button type="button" className="ml-auto shrink-0 rounded-full bg-white p-1 text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">View notifications</span>
                      <BellIcon aria-hidden="true" className="size-6" />
                    </button>
                  )}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {!user ? (
                    <>
                      <MobileProfileLink item={{ name: 'เข้าสู่ระบบ', href: '/LoginPage' }} closeMobileMenu={handleMobileLinkClick} />
                      <MobileProfileLink item={{ name: 'สมัครสมาชิก', href: '/RegisterPage' }} closeMobileMenu={handleMobileLinkClick} />
                      <MobileProfileLink item={{ name: 'ติดต่อ', href: '/Contact' }} closeMobileMenu={handleMobileLinkClick} />
                    </>
                  ) : (
                    loggedInProfileNavItems.map((item) => (
                      <MobileProfileLink key={item.name} item={item} closeMobileMenu={handleMobileLinkClick} />
                    ))
                  )}
                </div>
              </div>
            </DisclosurePanel>
          </>
        );
      }}
    </Disclosure>
  );
}