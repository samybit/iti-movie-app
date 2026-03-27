import SigninForm from "@/components/login-form";
import usePageTitle from "@/hooks/usePageTitle";

export default function Login() {
	usePageTitle("Login");
	return (
		<>
			<SigninForm />
		</>
	);
}