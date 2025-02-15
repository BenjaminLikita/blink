import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function Page() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <SignIn appearance={{ baseTheme: dark, elements: {
          card: {
            backgroundColor: "#1f272f"
          },
          input: {
            backgroundColor: "transparent",
          }
        } 
      }} />
    </div>
  )
}
