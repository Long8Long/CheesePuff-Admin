import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { authService } from '@/features/auth/services/auth.service'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  username: z.string().min(1, 'Please enter your username'),
  password: z.string().min(1, 'Please enter your password'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Step 1: Call auth service to login and get access token
      const loginResponse = await authService.login({
        username: data.username,
        password: data.password,
      })

      const { code, message, data: responseData } = loginResponse

      if (code === 200 && responseData) {
        // Step 2: Set access token first (required for getCurrentUser call)
        auth.setAccessToken(responseData.accessToken)

        // Step 3: Fetch current user info with the access token
        const meResponse = await authService.getCurrentUser()

        if (meResponse.code === 200 && meResponse.data) {
          // Step 4: Set user from /me endpoint (includes all user fields)
          auth.setUser(meResponse.data)
          toast.success('Login successful!')
        } else {
          // Fallback to login response user data if /me fails
          auth.setUser(responseData.user)
          toast.success('Login successful!')
        }

        // Step 5: Redirect to cats page or the stored location
        const targetPath = redirectTo || '/cats'
        await navigate({ to: targetPath, replace: true })
      } else {
        toast.error(message || 'Login failed')
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message ||
        'Network error, please try again'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Enter your username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>
      </form>
    </Form>
  )
}
