import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'

export default function ToggleSwitch({headingText,hasSubEvents,updateHasSubEvents}) {
    const [enabled, setEnabled] = useState(false)

    useEffect(()=>{
        updateHasSubEvents(enabled);
    },[enabled])

    return (
        <Switch.Group>
      <section className="flex items-center">
      <Switch.Label className="mr-4">{headingText}</Switch.Label>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${enabled ? 'bg-blue-500' : 'bg-white'}
            relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer outline outline-blue-500 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
        >
          <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
              pointer-events-none inline-block h-[34px] w-[34px] transform outline outline-blue-500 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </section>
      </Switch.Group>

    )
}