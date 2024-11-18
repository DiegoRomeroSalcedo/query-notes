import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getNotes, createNote, updateNote } from "./request"

const App = () => {

  /**
   * useQueryClient(): Este método nos proporciona acceso al Query Client que es el núcleo del sistema de caché y manejo de datos de React Query.
   * Con este podemos invalidar consultas, actualizar la caché directamente, acceder a datos en caché.
   */
  const queryClient = useQueryClient()

  const newMutation = useMutation({ // Para crear una nueva nota, se define con una mutacion usando la funcion useMutation
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes']}) // Haciendo uso de onSucces se invalida la query con key notes, haciendo que esta se vuelva a ejecutar en resumidas cuentas, esto con el proposito de que los cambios sean visibles al instante.
    }
  })

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newMutation.mutate({ content, important: true }) // El controlador de eventos realiza la mutacion llamando a la función mutate del objeto de mutación y pasando la nueva nota como parametro
  }

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes']})
    }
  })

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
  }

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return (
      <div className="loading-bar-container">
        <div className="loading-bar"></div>
      </div>
    )
  }

  const notes = result.data

  return(
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content} 
          <strong> {note.important ? 'important' : 'Not important'}</strong>
        </li>
      )}
    </div>
  )
}

export default App