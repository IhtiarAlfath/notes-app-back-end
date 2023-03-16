const { nanoid } = require('nanoid')
const notes = require('./notes')

const addNoteHandler = (request, h) => {
  const { title, body, tags } = request.payload

  const id = nanoid(16)
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  const newNote = {
    title, body, tags, id, createdAt, updatedAt
  }

  notes.push(newNote)

  const isSuccess = notes.filter((note) => note.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'catatan berhasil ditambahkan',
      data: {
        noteId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan gagal ditambahkan'
  })
  response.code(500)

  return response
}

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes
  }
})

const getNoteByIDHandler = (request, h) => {
  const { id } = request.params

  const note = notes.filter((n) => n.id === id)[0]

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan'
  })
  response.code(404)
  return response
}

const editNoteByIDHandler = (request, h) => {
  const { id } = request.params

  const { title, body, tags } = request.payload
  const updatedAt = new Date().toISOString()

  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      body,
      tags,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'catatan berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal Memperbarui data. catatan tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteNoteByIDHandler = (request, h) => {
  const { id } = request.params
  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'catatan berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIDHandler, editNoteByIDHandler, deleteNoteByIDHandler }
