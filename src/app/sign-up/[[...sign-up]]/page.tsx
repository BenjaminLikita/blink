import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function Page() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <SignUp appearance={{ baseTheme: dark, elements: {
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

{/* <div className='w-screen h-screen flex items-center justify-center'></div> */}