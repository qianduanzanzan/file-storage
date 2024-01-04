// let i = 0
export default {
    state: () => ({
        token: '',
        nick_name: '',
        avatar: '',
        user_id: '',
        is_admin: 0
    }),
    actions: {
        setUserInfo(data:any){
            const _this:any = this
            const {token = _this.token,nick_name = _this.nick_name,avatar = _this.avatar ,id = _this.user_id,is_admin = _this.is_admin} = data
            _this.token = token
            _this.nick_name = nick_name
            _this.avatar = avatar
            _this.user_id = id
            _this.is_admin = is_admin
            localStorage.setItem('userInfo',JSON.stringify({...data,token: token}))
        },
        clearUserInfo(){
            localStorage.removeItem('userInfo')
            const _this:any = this
            _this.token = ''
            _this.nick_name = ''
            _this.avatar = ''
            _this.user_id = ''
            _this.is_admin = 0
        }
    }
}