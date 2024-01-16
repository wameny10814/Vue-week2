import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
// import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11';

let productModal;
let delProductModal;
let editModal;

const app = createApp({
    data(){
        return {

        products:[],
        addPorduct:{
            title:'',
            category:'',
            origin_price:'',
            price:'',
            unit:'',
            description:'',
            content:'',
            is_enabled:0,
            imageUrl:'',
            imagesUrl:[],
            id:'',
        },
        api:{
            key:'tsurusroute'

        },
        showmutiplePic:{
            addInput:[],
        },
        temp:{

        },
        deleteid:'',
        tempProduct:{
      
        },

        
        }
    },
    mounted(){
        console.log('mounted');
        //登入成功拿剛剛存在cookie的token 用來驗證登入成功了沒
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        // console.log('token',token);
        axios.defaults.headers.common.Authorization = token;

        productModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
            keyboard: false
          });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false
        });
        editModal = new bootstrap.Modal(document.getElementById('editModal'), {
            keyboard: false
        });

        this.checklogined();



    },
    methods:{

        checklogined() {

            const api = 'https://vue3-course-api.hexschool.io/v2/api/user/check';
            axios.post(api).then((response) => {
    
                console.log('check login',response);
                //check 成功後叫產品資料
                this.getdata();
            
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        getdata(){
            const api = 'https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/products/all';
            axios.get(api).then((response) => {
    
                console.log('get products',response);
               this.products =response.data.products;
               
                

            }).catch((err) => {
                alert(err.response.data.message);
            });

        },
        getTemp(item){
            this.temp = item;
        },
        addmultiplePic(){
            console.log('點選新增圖片');
            //show出刪除按鈕
            //show出新增圖片input
            this.showmutiplePic.addInput.push('');
            
     
        },
        editmultiplePic(){
            console.log('clicked');
            this.tempProduct.addInput.push('');
      
            
        },
        deletemultiplePic(){
            console.log('delete');
            this.showmutiplePic.addInput.pop();
            this.addPorduct.imagesUrl.pop();
        },
        addProduct(){
            console.log('addProduct');
            const api = 'https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product';
            axios.post(api,{ data: this.addPorduct }).then((response) => {
    
                console.log('checked',response);
                //check 成功後叫產品資料
                if(response.data.success == true){
                    alert(response.data.message);
                    productModal.hide();
                    //重刷新product資料
                    this.getdata();

                }else{
                    alert(response.data.message)

                }
            
            }).catch((err) => {
                alert(err.response.data.message);
            });
            
        
        },
        editProduct(item){
            console.log('clicked editProduct',item);
            this.tempProduct = item;
            this.tempProduct.addInput=[];
            editModal.show();
        },
        showdeleteAlert(id){
            console.log('clicked showdeleteAlert',id);
            this.deleteid= id;
            delProductModal.show();

        },
        deletePorduct(){
            console.log('clicked deletePorduct');
            //新增刪除警告 to do-----------------------------------
            // Swal.fire("SweetAlert2 is working!");
          

            const api = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product/${this.deleteid}`;
            axios.delete(api).then((response) => {
    
                console.log('delete',response);
                //check 成功後叫產品資料
                if(response.data.success == true){
                    alert(response.data.message);
                    delProductModal.hide();
            
                    //重刷新product資料
                    this.getdata();

                }else{
                    alert(response.data.message)

                }
            
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },

    },

    }
    );

app.mount('#app');