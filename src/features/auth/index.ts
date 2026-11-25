export type { AuthSession, AuthUser } from '@/features/auth/domain/entities/auth-session';
export { AuthBootstrapper } from '@/features/auth/presentation/components/auth-bootstrapper';
export {
  useAuth,
  useSendMagicLinkMutation,
  useSignOutMutation,
} from '@/features/auth/presentation/hooks/use-auth';
export { LoginScreen } from '@/features/auth/presentation/screens/login-screen';
