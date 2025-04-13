import Vue from 'vue';
import VueRouter from 'vue-router';
import Photobooth from '../components/Photobooth.vue';
import LoveNotes from '../components/LoveNotes.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Photobooth },
  { path: '/love-notes', component: LoveNotes },
];

const router = new VueRouter({
  routes,
});

export default router;