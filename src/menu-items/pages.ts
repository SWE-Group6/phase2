// assets
import { IconBrandReact } from '@tabler/icons-react';

// constant
const icons = {
    IconBrandReact
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Packages',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Actions',
            type: 'collapse',
            icon: icons.IconBrandReact,

            children: [
                {
                    id: 'login3',
                    title: 'Upload',
                    type: 'item',
                    url: '/dashboard',
                    target: true
                },
                {
                    id: 'register3',
                    title: 'Delete',
                    type: 'item',
                    url: '/dashboard',
                    target: true
                },
                {
                    id: 'login3',
                    title: 'Rate',
                    type: 'item',
                    url: '/dashboard',
                    target: true
                },
                {
                    id: 'register3',
                    title: 'Reset',
                    type: 'item',
                    url: '/dashboard',
                    target: true
                }
            ]
        }
    ]
};

export default pages;