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
    return response

  } catch (error) {
    console.log('error:', error.message)
    return new Error('Error postData')
  }
}