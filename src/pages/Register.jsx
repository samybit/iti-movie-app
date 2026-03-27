import SignupForm from "@/components/signup-form";
import usePageTitle from "@/hooks/usePageTitle";

export default function Register() {
	usePageTitle("Register");
	return (
		<>
			<SignupForm />
		</>
	);
}