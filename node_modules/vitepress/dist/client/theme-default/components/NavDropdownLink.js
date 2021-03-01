import NavBarLink from './NavBarLink.vue';
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vitepress';
export default defineComponent({
    name: 'DropdownLink',
    components: {
        NavBarLink
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const open = ref(false);
        const route = useRoute();
        watch(() => route.path, () => {
            open.value = false;
        });
        const setOpen = (value) => {
            open.value = value;
        };
        const isLastItemOfArray = (item, array) => {
            return array.length && array.indexOf(item) === array.length - 1;
        };
        return {
            open,
            setOpen,
            isLastItemOfArray
        };
    }
});
