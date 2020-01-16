import { UserManager } from 'oidc-client';

class CognitoUserManager extends UserManager {
	_signinStart(args, navigator, navigatorParams = {}) {
		return navigator.prepare(navigatorParams).then(handle => {
			return this.createSigninRequest(args)
				.then(signinRequest => {
					navigatorParams.url = signinRequest.url.replace('%20id_token', '');
					navigatorParams.id = signinRequest.state.id;

					return handle.navigate(navigatorParams);
				})
				.catch(err => {
					if (handle.close) {
						console.log(
							'Error after preparing navigator, closing navigator window'
						);
						handle.close();
					}
					throw err;
				});
		});
	}
}
export default CognitoUserManager;
// const createUserManager = settings =>
// 	new CognitoUserManager({
// 		...settings
// 	});

// export default createUserManager;
