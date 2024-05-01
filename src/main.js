import { createApp } from 'vue'
import './style.css'



import App from './App.vue'
import router from './router'
import ToastService from "primevue/toastservice";
import PrimeVue from 'primevue/config';

// App Theme
import 'primevue/resources/themes/md-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Add Primeflex
import 'primeflex/primeflex.css';

// Add Components
import Card from "primevue/card";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import Sidebar from "primevue/sidebar";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Toolbar from "primevue/toolbar";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import FileUpload from "primevue/fileupload";
import Dropdown from "primevue/dropdown";
import InputSwitch from "primevue/inputswitch";

createApp(App)
    .use(router)
    .use(PrimeVue, {ripple: true})
    .use(ToastService)
    .component('pv-tag', Tag)
    .component('pv-column', Column)
    .component('pv-input-switch', InputSwitch)
    .component('pv-dropdown', Dropdown)
    .component('pv-file-upload', FileUpload)
    .component('pv-dialog', Dialog)
    .component('pv-textarea', Textarea)
    .component('pv-divider', Divider)
    .component('pv-input-text', InputText)
    .component('pv-data-table', DataTable)
    .component('pv-card', Card)
    .component('pv-button', Button)
    .component('pv-select-button', SelectButton)
    .component('pv-sidebar', Sidebar)
    .component('pv-avatar', Avatar)
    .component('pv-menu', Menu)
    .component('pv-menubar', Menubar)
    .component('pv-toolbar', Toolbar)
    .component('pv-toast', Toast)
    .mount('#app')
