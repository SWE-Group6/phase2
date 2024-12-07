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
                    id: 'upload',
                    title: 'Upload',
                    type: 'item',
                    url: '/actions/upload',
                    breadcrumbs: false
                },
                {
                    id: 'delete',
                    title: 'Delete',
                    type: 'item',
                    url: '/actions/delete',
                    breadcrumbs: false
                },
                {
                    id: 'rate',
                    title: 'Rate',
                    type: 'item',
                    url: '/actions/rate',
                    breadcrumbs: false
                },
                {
                    id: 'reset',
                    title: 'Reset',
                    type: 'item',
                    url: '/actions/reset',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default pages;