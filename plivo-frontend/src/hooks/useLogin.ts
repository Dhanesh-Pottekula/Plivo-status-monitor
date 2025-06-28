import React, { useState } from 'react'
import { validateEmail, validatePassword } from '../_helpers/validators'
import { useDispatch } from 'react-redux'
import { getUser, login, type LoginFormData } from '@/_redux/userSlice'
import type { AppDispatch } from '@/store'

function useLogin() {
    const dispatch = useDispatch<AppDispatch> ()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
      })
      const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
      const [isLoading, setIsLoading] = useState(false)
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
          ...prev,
          [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
          setErrors(prev => ({
            ...prev,
            [name]: undefined
          }))
        }
      }
    
      const validateForm = () => {
        const emailError = validateEmail(formData.username)
        const passwordError = validatePassword(formData.password, 6) // Using 6 as min length for login
    
        const newErrors: { username?: string; password?: string } = {}
        
        if (emailError) {
          newErrors.username = emailError
        }
        if (passwordError) {
          newErrors.password = passwordError
        }
    
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
          return
        }
    
        setIsLoading(true)
        
        try {
            await dispatch(login(formData as LoginFormData))
            await dispatch(getUser())
        } catch (error) {
          console.error('Login failed:', error)
        } finally {
          setIsLoading(false)
        }
      }

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
  }
}

export default useLogin