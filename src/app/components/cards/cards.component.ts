import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { iBusqueda } from 'src/app/models/busqueda.interface';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { BusquedaService } from 'src/app/services/busqueda.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
 
  public formGroup: FormGroup;
  public busquedas: iBusqueda[] = [];
  public editBusqueda: iBusqueda | undefined;
  public deleteBusqueda: iBusqueda | undefined;

  constructor(
    private busquedaService: BusquedaService,
    public autenticacionService: AutenticacionService,
    private formBuilder: FormBuilder
  ) { 
    //Se creo un Reactive Form (para reemplazar el Template Form que estaba)
    this.formGroup = this.formBuilder.group({
      nombre: ['', Validators.required],
      localidad: ['', Validators.required],
      telefono: ['', Validators.required],
      img: []
    });
  }

  ngOnInit(): void {
    this.getBusqueda();
  }

  isloged = () => this.autenticacionService.loggedIn();

  public getBusqueda(): void {
    this.busquedaService.getBusqueda().subscribe({
      next: (response: iBusqueda[]) => {
        this.busquedas = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  public onOpenModal(mode: string, busqueda?: iBusqueda): void {
    const container = document.getElementById('addBusquedaModal');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addBusquedaModal');
    } else if (mode === 'delete') {
      this.deleteBusqueda = busqueda;
      button.setAttribute('data-bs-target', '#deleteBusquedaModal');
    } else if (mode === 'edit') {
      this.editBusqueda = busqueda;
      button.setAttribute('data-bs-target', '#editBusquedaModal');
    }

    container?.appendChild(button);
    button.click();
  }

  //Escucha al evento del <input type=file>
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formGroup.get("img")?.setValue(file);
    }
  }

  //Envía el formulario reactivo
  public onAddBusqueda(): void {
    document.getElementById('add-busqueda-form')?.click();
    let formData: FormData = new FormData();

    formData.append("nombre", this.formGroup.get("nombre")?.value);
    formData.append("localidad", this.formGroup.get("localidad")?.value);
    formData.append("telefono", this.formGroup.get("telefono")?.value);
    formData.append("img", this.formGroup.get("img")?.value);

    this.busquedaService.addBusqueda(formData).subscribe({
      next: (response: iBusqueda) => {
        this.getBusqueda();
        this.formGroup.reset();
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        this.formGroup.reset();
      },
    }); 
  }

/*  public onAddBusqueda(addForm: NgForm): void {
    document.getElementById('add-busqueda-form')?.click();
    this.busquedaService.addBusqueda(addForm.value).subscribe({
      next: (response: iBusqueda) => {
        this.getBusqueda();
        addForm.reset();
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      },
    });
  } */

public onUpdateBusqueda(busqueda:iBusqueda){
  this.editBusqueda=busqueda;
  document.getElementById('edit-busqueda-form')?.click();
  this.busquedaService.updateBusqueda(busqueda).subscribe({
    next: (response:iBusqueda)=>{
     /*  console.log(response); */
      this.getBusqueda();
    },error:(error:HttpErrorResponse)=>{
      alert(error.message);
    }
  })
}

public onDeleteBusqueda(idBusqueda: number): void {
  this.busquedaService.deleteBusqueda(idBusqueda).subscribe({
    next: (response: void) => {
     /*  console.log(response); */
      this.getBusqueda();
    },
    error: (error: HttpErrorResponse) => {
      alert(error.message);
    },
  });
} 


}
