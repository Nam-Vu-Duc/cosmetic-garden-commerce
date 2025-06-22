const notificationIcon = document.querySelector('div.admin-notification')
const notificationBody = document.querySelector('div.notification-box')
const readAllIcon = notificationBody.querySelector('i.fi.fi-rr-progress-complete')

socket.on('order', async function(id) {
  await fetch('/admin/all/data/notification', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      message: `Bạn có đơn hàng mới: ${id}`,
      type: 'order'
    })
  })
  getNotification()
})

notificationIcon.onclick = function() {
  notificationBody.style.display = notificationBody.style.display === 'none' ? 'block' : 'none'
}

socket.on('privateMessage', async function(id) {
  await fetch('/admin/all/data/notification', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      message: `Bạn có tin nhắn mới: ${id}`,
      type: 'order'
    })
  })
  getNotification()
})

readAllIcon.onclick = async function() {
  const response = await fetch('/admin/all/update/all-notifications', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data, error} = await response.json()
  if (error) return pushNotification(error)
  getNotification()
}

async function getNotification() {
  const response = await fetch('/admin/all/data/notification', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data, error} = await response.json()
  if (error) return pushNotification(error)

  notificationBody.querySelector('div.box-content').querySelectorAll('div.notification-details').forEach((div) => {
    div.remove()
  })
    
  let unreadQuantity = 0
  data.forEach((item, index) => {
    const id = item.message.split(':')[1].trim()
    const newNotification = document.createElement('div')
    newNotification.classList.add('notification-details')
    if (item.isRead === false) {
      newNotification.classList.add('unread')
      unreadQuantity++
    } 
    newNotification.innerHTML = `
      <img src="https://cosmeticgarden.vn/wp-content/uploads/2024/12/logo-xanh-gradient.png" alt="loading">
      <a href='/admin/all-orders/order/${id}'>${formatDate(item.createdAt)}: ${item.message}</a>
    `
    newNotification.onclick = async function() {
      const response = await fetch('/admin/all/update/notification', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: item._id
        })
      })
      if (!response.ok) throw new Error(`Response status: ${response.status}`)
      const {message, error} = await response.json()
      if (error) return pushNotification(error)
    }
    notificationBody.querySelector('div.box-content').appendChild(newNotification)
  })
  notificationIcon.querySelector('span.unread-quantity').textContent = unreadQuantity
}

window.addEventListener('DOMContentLoaded', getNotification)