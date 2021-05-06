<template>
	<div class="container">
		<div class="content">
			<div class="top">
				<div class="header">
					<a to="/">
						<img alt="logo" class="logo" :src="logo" />
						<span class="title">太工请销假系统</span>
					</a>
				</div>
				<div class="desc"></div>
			</div>
			<div class="login-main">
				<h3 class="login-title">管理员登录</h3>
				<el-form
					:model="dataForm"
					:rules="dataRule"
					ref="dataForm"
					@keyup.enter.native="dataFormSubmit()"
					status-icon
				>
					<el-form-item prop="userName">
						<el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input
							v-model="dataForm.password"
							type="password"
							placeholder="密码"
						></el-input>
					</el-form-item>
					<el-form-item prop="captcha">
						<el-row :gutter="20">
							<el-col :span="14">
								<el-input v-model="dataForm.captcha" placeholder="验证码">
								</el-input>
							</el-col>
							<el-col :span="10" class="login-captcha">
								<img :src="captchaPath" @click="getCaptcha()" alt="" />
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item>
						<el-button
							class="login-btn-submit"
							type="primary"
							@click="dataFormSubmit()"
							>登录</el-button
						>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script>
import { getUUID } from "@/utils";
import logo from "@/assets/img/logo.png";
export default {
	data() {
		return {
			dataForm: {
				userName: "",
				password: "",
				uuid: "",
				captcha: "",
			},
			dataRule: {
				userName: [
					{ required: true, message: "帐号不能为空", trigger: "blur" },
				],
				password: [
					{ required: true, message: "密码不能为空", trigger: "blur" },
				],
				captcha: [
					{ required: true, message: "验证码不能为空", trigger: "blur" },
				],
			},
			captchaPath: "",
      logo
		};
	},
	created() {
		this.getCaptcha();
	},
	methods: {
		// 提交表单
		dataFormSubmit() {
			this.$refs["dataForm"].validate((valid) => {
				if (valid) {
					this.$http({
						url: this.$http.adornUrl("/sys/login"),
						method: "post",
						data: this.$http.adornData({
							username: this.dataForm.userName,
							password: this.dataForm.password,
							uuid: this.dataForm.uuid,
							captcha: this.dataForm.captcha,
						}),
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$cookie.set("token", data.token);
							this.$router.replace({ name: "home" });
						} else {
							this.getCaptcha();
							this.$message.error(data.msg);
						}
					});
				}
			});
		},
		// 获取验证码
		getCaptcha() {
			this.dataForm.uuid = getUUID();
			this.captchaPath = this.$http.adornUrl(
				`/captcha.jpg?uuid=${this.dataForm.uuid}`
			);
		},
	},
};
</script>

<style lang="scss">
.container {
	.login-main {
    width: 388px;
    margin: 0 auto;
    text-align: center;
	}
	.login-title {
		font-size: 16px;
	}
	.login-captcha {
		overflow: hidden;
		> img {
			width: 100%;
			cursor: pointer;
		}
	}
	.login-btn-submit {
		width: 100%;
		margin-top: 38px;
	}
}
</style>
<style scoped lang="less">
@layout-body-background: #f0f2f5;
@screen-md-min: 768px;
@text-color-secondary: rgba(0, 0, 0, 0.45);
@font-size-base: 14px;
@heading-color: rgba(0, 0, 0, 0.85);

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: @layout-body-background;
}

.lang {
  width: 100%;
  height: 40px;
  line-height: 44px;
  text-align: right;
  :global(.ant-dropdown-trigger) {
    margin-right: 24px;
  }
}

.content {
  flex: 1;
  padding: 32px 0;
}

@media (min-width: @screen-md-min) {
  .container {
    background-image: url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg");
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
  }

  .content {
    padding: 32px 0 24px 0;
  }
}

.top {
  text-align: center;
}

.header {
  height: 44px;
  line-height: 44px;
  a {
    text-decoration: none;
  }
}

.logo {
  height: 44px;
  vertical-align: top;
}

.title {
  position: relative;
  top: 2px;
  display: inline-block;
  width: 6rem;
  color: @heading-color;
  font-weight: 600;
  font-size: .8rem;
  font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
}

.desc {
  margin-top: 12px;
  margin-bottom: 40px;
  color: @text-color-secondary;
  font-size: @font-size-base;
}
</style>