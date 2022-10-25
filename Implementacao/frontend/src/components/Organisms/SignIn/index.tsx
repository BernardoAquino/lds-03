import React from 'react';
import { useNavigate } from 'react-router-dom';

/** Constants */
import { BUSINESS_SIGNUP_URL, STUDENT_SIGNUP_URL } from '../../../constants';

/** Hooks */
import { Form } from '../../../hooks/useForm';
import useSignIn, { UserCredentials } from '../../../hooks/useSignIn';

/** Components */
import SignInForm from '../SignInForm';

/** Style */
import * as El from './SignIn.style';

const UserSignUp = () => {
  const navigate = useNavigate();
  const { signIn } = useSignIn();

  const handleSubmit = (formValues: Form) => {
    signIn(formValues as UserCredentials).then(response => {
      if (!response.error && response?.userType) {
        const urlMap = {
          business: '/',
          student: '/',
          institution: '/',
        }

        navigate(urlMap[response.userType]);
      }
    });
  }

  return (
    <El.Wrapper>
      <El.Title>Entre com suas credenciais</El.Title>
      <SignInForm onSubmit={handleSubmit} />
      <El.DividerText>OU</El.DividerText>
      <El.CreateAccountText href={STUDENT_SIGNUP_URL}>Crie uma conta de aluno</El.CreateAccountText>
      <El.DividerText>OU</El.DividerText>
      <El.CreateAccountText href={BUSINESS_SIGNUP_URL}>Crie uma conta de empresa parceira</El.CreateAccountText>
    </El.Wrapper>
  )
}

export default UserSignUp;