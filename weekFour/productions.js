import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let addproductModal;
let editModall;
let deleteinfo;

const app = createApp({
    data() {
        return {
            products: [],
            api: {
                key: 'tsurusroute'

            },
            tempProduct: {},
            pagedata: {},
            pages: {},
            temp: {},
            deleteProduct: {},
        


        }
    },
    mounted() {
        //登入成功拿剛剛存在cookie的token 用來驗證登入成功了沒
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    
        axios.defaults.headers.common.Authorization = token;

        addproductModal = new bootstrap.Modal(document.getElementById('addMmodelComponent'), {
            keyboard: false
        });
        editModall = new bootstrap.Modal(document.getElementById('editModall'), {
            keyboard: false
        });
        deleteinfo = new bootstrap.Modal(document.getElementById('deleteinfo'), {
            keyboard: false
        });

    
        this.checklogined();



    },
    methods: {

        checklogined() {
            const api = 'https://ec-course-api.hexschool.io/v2/api/user/check';
            axios.post(api).then((response) => {

                //check 成功後叫第一頁產品資料
                this.getpagination();

            }).catch((err) => {
                alert(err.data.message);
                window.location = 'login.html';

            });
        },
        getpagination(page = 1) {
            if (page == 'prev') {
                page = this.pages.current_page - 1;

            } else if (page == 'next') {
                page = this.pages.current_page + 1;
            }
            //打api 送 點到的page 拿取當夜資料
            const apiurl = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/products?page=${page}`;

            axios.get(apiurl).then((response) => {
                this.products = response.data.products;
                this.pages = response.data.pagination;



            }).catch((err) => {
                alert(err.data.message);
            });

        },
        openmodel(type,editData) {
            if (type == 'addMmodelComponent') {
                addproductModal.show();
            } if (type == 'editMmodelComponent') {
                editModall.show();
                this.temp = editData;
            }

        },

        addProduct(data) {
            const api = 'https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product';
            axios.post(api, { data: data }).then((response) => {
                if (response.data.success == true) {
                    alert(response.data.message);
                    addproductModal.hide();
                    //重刷新product資料
                    this.getpagination();

                } else {
                    alert(response.data.message)

                }

            }).catch((err) => {
                alert(err.data.message);
            });



        },
        edit(item){

            const api = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product/${item.id}`;
            axios.put(api, { data: item }).then((response) => {

                //check 成功後叫產品資料
                if (response.data.success == true) {
                    alert(response.data.message);
                    editModall.hide();
                    //重刷新product資料
                    this.getpagination();

                } else {
                    alert(response.data.message);
                }

            }).catch((err) => {
                alert(err.data.message);
            });

        },

        showdeleteAlert(item) {
            this.deleteProduct = item;
            deleteinfo.show();

        },
        deletePorduct(data) {
            const api = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product/${data.id}`;
            axios.delete(api).then((response) => {

                if (response.data.success == true) {
                    alert(response.data.message);
                    deleteinfo.hide();

                    //重刷新product資料
                    this.getpagination();

                } else {
                    alert(response.data.message)

                }

            }).catch((err) => {
                alert(err.data.message);
            });
        },

    },

}
);
app.component('pagination', {
    data() {
        return {
            page: 0,
        }
    },
    props: ["parent"],
    methods: {
        emit(item) {
            this.$emit('emit-text', item);
        }
    },
    template:'#x-pagination',

});
app.component('newproduct', {
    data() {
        return {
            test: '',
            addPorduct: {
                title: '',
                category: '',
                origin_price: '',
                price: '',
                unit: '',
                description: '',
                content: '',
                is_enabled: 0,
                imageUrl: '',
                imagesUrl: [],
                id: '',
            },
        }


    },
    methods: {
        emit() {
            this.$emit('pushnewproduct', this.addPorduct);
        },
        addmultiplePic() {

            this.addPorduct.imagesUrl.push('');
        },
        deletemultiplePic() {
            this.addPorduct.imagesUrl.pop();

        },

    },
    template:'#x-newproduct',
});
app.component('editmodelcomponent', {
    data() {
        return {
            test: '',
            addPorduct: {
                title: '',
                category: '',
                origin_price: '',
                price: '',
                unit: '',
                description: '',
                content: '',
                is_enabled: 0,
                imageUrl: '',
                imagesUrl: [],
                id: '',
            },
        }

    },
    methods: {
        addmultiplePic() {
            this.theproduct.imagesUrl.push('');
        },
        deletemultiplePic() {
            this.theproduct.imagesUrl.pop();
        },
        emit(item){
            this.$emit('pusheditproduct', item);
            
        }

    },
    props: ['theproduct'],
    template:'#x-editmodelcomponent',

});
app.component('deletecomponent',{
    data(){
        return{
            test:'',
        }
    },
    methods:{
        emit(item){
            this.$emit('pushdeleteproduct', item);

        }
    },
    props:['deleteproduct'],
    template:`
            <div id="deleteinfo" ref="delProductModal" class="modal fade" tabindex="-1"
            aria-labelledby="delProductModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 id="delProductModalLabel" class="modal-title">
                    <span>刪除產品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    是否刪除
                    <strong class="text-danger">{{deleteproduct.title}}</strong> 商品(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    取消
                    </button>
                    <button type="button" class="btn btn-danger" @click="emit(deleteproduct)">
                    確認刪除
                    </button>
                </div>
                </div>
            </div>
        </div>
    `
});

app.mount('#app');