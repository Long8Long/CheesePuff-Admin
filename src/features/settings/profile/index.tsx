import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title='个人资料'
      desc='这是您的信息。'
    >
      <ProfileForm />
    </ContentSection>
  )
}
