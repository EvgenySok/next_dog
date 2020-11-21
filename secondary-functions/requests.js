const contentType = 'application/json'

export const postData = async (data, linc) => {
  try {
    const res = await fetch(linc, {
      method: 'POST',
      headers: {
        Accept: contentType,
        'Content-Type': contentType,
      },
      body: JSON.stringify(data),
    })
    const response = await res.json()
    console.log('res.json() ', response)
    return response

    // Throw error with status code in case Fetch API req failed
    // if (!res.ok) {
    //   throw new Error(res.status)
    // }

  } catch (error) {
    console.log('error:', error.message)

    // setMessage('Failed to add pet')
  }
}